const db = require('../db');

// Funzione per un utente per ottenere i suoi dati
exports.getCurrentUser = (req, res) => {
  const userId = req.userData.userId; 
  const sql = `
    SELECT
      u.id, u.username, u.email, u.full_name, u.phone, u.role,
      c.trainer_id,
      pt.full_name AS assignedTrainerName
    FROM users u
    LEFT JOIN customers c ON u.id = c.user_id
    LEFT JOIN users pt ON c.trainer_id = pt.id
    WHERE u.id = ?
  `;

  db.get(sql, [userId], (err, user) => {
    if (err) {
      console.error("Errore nel recuperare i dati utente:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato." });
    }
    res.status(200).json(user);
  });
};

// Funzione per un PT per ottenere la lista dei suoi clienti assegnati
exports.getAssignedClient = (req, res) => {
  const trainerId = req.userData.userId; 
  const sql = `
    SELECT u.id, u.full_name, u.email, u.phone 
    FROM users u
    JOIN customers c ON u.id = c.user_id
    WHERE c.trainer_id = ?
  `;

  db.all(sql, [trainerId], (err, customers) => {
    if (err) {
      console.error("[Controller] ERRORE in getAssignedClient:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(customers);
  });
};