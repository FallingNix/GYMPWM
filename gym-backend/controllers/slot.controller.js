const db = require('../db');

// Funzione per un PT per creare uno slot di disponibilità
exports.createSlot = (req, res) => {
  const trainerId = req.userData.userId; 
  const { start_time, end_time, max_clients } = req.body; 

  const now = new Date();
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (start.getTime() < (now.getTime() - 60000)) { 
    return res.status(400).json({ message: "Non puoi creare uno slot nel passato." });
  }
  if (end <= start) {
    return res.status(400).json({ message: "L'orario di fine deve essere successivo all'orario di inizio." });
  }
  const sql = 'INSERT INTO training_slots (trainer_id, start_time, end_time, max_clients) VALUES (?, ?, ?, ?)'; 
  db.run(sql, [trainerId, start_time, end_time, max_clients || 1], function(err) { 
    if (err) {
      console.error("Errore nella creazione dello slot:", err); 
      return res.status(500).json({ message: "Errore del server." }); 
    }
    res.status(201).json({ message: "Slot creato con successo!", slotId: this.lastID }); 
  });
};

// Funzione per vedere i slot creati 
exports.getMySlots = (req, res) => {
  const trainerId = req.userData.userId;
  const sql = `
    SELECT ts.*, COUNT(b.id) AS booked_count
    FROM training_slots ts
    LEFT JOIN bookings b ON ts.id = b.slot_id
    WHERE ts.trainer_id = ?
    GROUP BY ts.id
    ORDER BY ts.start_time DESC
  `;
  db.all(sql, [trainerId], (err, slots) => {
    if (err) {
      console.error("Errore nel recuperare gli slot del PT:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(slots);
  });
};

// Funzione per vedere tutti gli slot di un PT specifico
exports.getSlotsByTrainer = (req, res) => {
  const { trainerId } = req.params; 
  const sql = `
    SELECT ts.*, COUNT(b.id) AS booked_count
    FROM training_slots ts
    LEFT JOIN bookings b ON ts.id = b.slot_id
    WHERE ts.trainer_id = ?
    GROUP BY ts.id
    ORDER BY ts.start_time DESC
  `;
  db.all(sql, [trainerId], (err, slots) => {
    if (err) {
      console.error("Errore nel recuperare gli slot del PT:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(slots);
  });
};

// Funzione per un PT per eliminare uno slot
exports.deleteSlot = (req, res) => {
  const { slotId } = req.params;
  const trainerId = req.userData.userId; 

  db.get('SELECT trainer_id FROM training_slots WHERE id = ?', [slotId], (err, slot) => {
    if (err) {
      console.error("Errore nel recupero dello slot per cancellazione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (!slot) {
      return res.status(404).json({ message: "Slot non trovato." });
    }
    if (slot.trainer_id !== trainerId) {
      return res.status(403).json({ message: "Accesso negato: non puoi eliminare uno slot che non hai creato tu." });
    }

    db.run('DELETE FROM training_slots WHERE id = ?', [slotId], function(err) {
      if (err) {
        console.error("Errore nell'eliminazione dello slot:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      res.status(200).json({ message: "Slot eliminato con successo." });
    });
  });
};