const db = require('../db');

// Funzione per ottenere tutti gli utenti in base a un ruolo
exports.getUsersByRole = (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ message: "Specificare un ruolo (?role=PT o ?role=utente)." });
  }

  const sql = `
    SELECT u.id, u.username, u.email, u.full_name, u.phone, c.trainer_id 
    FROM users u
    LEFT JOIN customers c ON u.id = c.user_id
    WHERE u.role = ?
  `;
  
  db.all(sql, [role], (err, users) => {
    if (err) {
      console.error("Errore nel recuperare gli utenti:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(users);
  });
};

// Funzione per assegnare un trainer a un cliente
exports.assignTrainer = (req, res) => {
  const { customer_id, trainer_id } = req.body;

  if (!customer_id || !trainer_id) {
    return res.status(400).json({ message: "ID cliente e ID trainer sono richiesti." });
  }

  const sql = 'UPDATE customers SET trainer_id = ? WHERE user_id = ?';
  db.run(sql, [trainer_id, customer_id], function(err) {
    if (err) {
      console.error("Errore nell'assegnare il trainer:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json({ message: `Trainer ${trainer_id} assegnato al cliente ${customer_id}.` });
  });
};

// Funzione per rimuovere l'assegnazione di un trainer da un cliente
exports.unassignTrainer = (req, res) => {
  const { customer_id } = req.params;

  if (!customer_id) {
    return res.status(400).json({ message: "L'ID del cliente è richiesto." });
  }

  const sql = 'UPDATE customers SET trainer_id = NULL WHERE user_id = ?';
  db.run(sql, [customer_id], function(err) {
    if (err) {
      console.error("Errore nella rimozione dell'assegnazione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json({ message: `Assegnazione rimossa per il cliente ${customer_id}.` });
  });
};