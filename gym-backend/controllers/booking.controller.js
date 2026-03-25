const db = require('../db');

// Funzione per un utente per prenotare uno slot
exports.createBooking = (req, res) => {
  const customerId = req.userData.userId; 
  const { slot_id } = req.body; 
  if (!slot_id) {
    return res.status(400).json({ message: "È necessario specificare uno slot." });
  }
  const checkSql = `
    SELECT 
      ts.max_clients,
      (SELECT COUNT(*) FROM bookings WHERE slot_id = ts.id) AS current_bookings,
      (SELECT COUNT(*) FROM bookings WHERE slot_id = ts.id AND customer_id = ?) AS user_already_booked
    FROM training_slots ts
    WHERE ts.id = ?
  `;

  db.get(checkSql, [customerId, slot_id], (err, row) => {
    if (err) {
      console.error("Errore nel controllo disponibilità:", err);
      return res.status(500).json({ message: "Errore del server." });
    }

    if (!row) {
      return res.status(404).json({ message: "Slot non trovato." });
    }
    if (row.user_already_booked > 0) {
      return res.status(400).json({ message: "Ti sei già prenotato per questo slot!" });
    }
    if (row.current_bookings >= row.max_clients) {
      return res.status(400).json({ message: "Spiacenti, questo slot è già al completo." });
    }
    const sql = 'INSERT INTO bookings (customer_id, slot_id, booking_date, status) VALUES (?, ?, ?, ?)';
    db.run(sql, [customerId, slot_id, new Date().toISOString(), 'confirmed'], function(err) {
      if (err) {
        console.error("Errore nella creazione della prenotazione:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      res.status(201).json({ 
        message: "Prenotazione effettuata con successo!", 
        bookingId: this.lastID 
      });
    });
  });
};

// Funzione per un utente per vedere le proprie prenotazioni
exports.getMyBookings = (req, res) => {
  const customerId = req.userData.userId; 
  const sql = `
    SELECT 
      b.id AS booking_id, 
      b.status,
      ts.start_time,
      ts.end_time,
      ts.trainer_id,
      pt.full_name AS trainer_name
    FROM bookings b
    JOIN training_slots ts ON b.slot_id = ts.id
    JOIN users pt ON ts.trainer_id = pt.id
    WHERE b.customer_id = ?
    ORDER BY ts.start_time DESC
  `;
  
  db.all(sql, [customerId], (err, bookings) => {
    if (err) {
      console.error("Errore nel recuperare le prenotazioni:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    const formattedBookings = bookings.map(booking => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return {
        ...booking,
        start_time_formatted: new Date(booking.start_time).toLocaleDateString('it-IT', options),
        start_time_hours: new Date(booking.start_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        end_time_hours: new Date(booking.end_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      };
    });
    res.status(200).json(formattedBookings);
  });
};

// Funzione per eliminare una prenotazione
exports.deleteBooking = (req, res) => {
  const { bookingId } = req.params;
  const { userId, role } = req.userData;

  db.get('SELECT customer_id FROM bookings WHERE id = ?', [bookingId], (err, booking) => {
    if (err) {
      console.error("Errore nel recuperare la prenotazione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (!booking) {
      return res.status(404).json({ message: "Prenotazione non trovata." });
    }
    if (booking.customer_id !== userId && role !== 'admin') {
      return res.status(403).json({ message: "Accesso negato. Non puoi eliminare questa prenotazione." });
    }

    db.run('DELETE FROM bookings WHERE id = ?', [bookingId], function(err) {
      if (err) {
        console.error("Errore nell'eliminazione della prenotazione:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      res.status(200).json({ message: "Prenotazione eliminata con successo." });
    });
  });
};