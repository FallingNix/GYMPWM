const db = require('../db');

// Funzione per un utente per creare una valutazione per un PT
exports.createRating = (req, res) => {
  const customerId = req.userData.userId;
  const { trainer_id, rating, review } = req.body;

  if (req.userData.role !== 'utente') {
    return res.status(403).json({ message: "Operazione non permessa. Solo gli utenti possono lasciare valutazioni." });
  }

  if (!trainer_id || !rating) {
    return res.status(400).json({ message: "L'ID del trainer e un voto sono obbligatori." });
  }

  const sql = 'INSERT INTO ratings (customer_id, trainer_id, rating, review, date) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [customerId, trainer_id, rating, review, new Date().toISOString()], function(err) {
    if (err) {
      console.error("Errore nella creazione della valutazione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(201).json({ message: "Valutazione aggiunta con successo!", ratingId: this.lastID });
  });
};

// Funzione per eliminare una valutazione
exports.deleteRating = (req, res) => {
  const { ratingId } = req.params;
  const { userId, role } = req.userData;

  db.get('SELECT customer_id FROM ratings WHERE id = ?', [ratingId], (err, rating) => {
    if (err) {
      console.error("Errore nel recuperare la valutazione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (!rating) {
      return res.status(404).json({ message: "Valutazione non trovata." });
    }
    if (rating.customer_id !== userId && role !== 'admin') {
      return res.status(403).json({ message: "Accesso negato. Non puoi eliminare questa valutazione." });
    }

    db.run('DELETE FROM ratings WHERE id = ?', [ratingId], function(err) {
      if (err) {
        console.error("Errore nell'eliminazione della valutazione:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      res.status(200).json({ message: "Valutazione eliminata con successo." });
    });
  });
};

// Funzione per ottenere le valutazioni di un PT
exports.getRatingsForTrainer = (req, res) => {
  const { trainerId } = req.params;
  const sql = `
    SELECT r.rating, r.review, r.date, u.full_name AS customer_name
    FROM ratings r
    JOIN users u ON r.customer_id = u.id
    WHERE r.trainer_id = ?
    ORDER BY r.date DESC
  `;
  db.all(sql, [trainerId], (err, ratings) => {
    if (err) {
      console.error("Errore nel recuperare le valutazioni:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(ratings);
  });
};