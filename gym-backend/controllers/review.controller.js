const db = require('../db');

// Funzione per un utente per creare una recensione della palestra
exports.createGymReview = (req, res) => {
  const customerId = req.userData.userId;
  const { rating, review } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "Un voto è obbligatorio." });
  }
  
  const sql = 'INSERT INTO gym_reviews (customer_id, rating, review, date) VALUES (?, ?, ?, ?)';
  db.run(sql, [customerId, rating, review, new Date().toISOString()], function(err) {
    if (err) {
      console.error("Errore nella creazione della recensione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(201).json({ message: "Recensione della palestra aggiunta con successo!" });
  });
};

// Funzione PUBBLICA per ottenere le recensioni della palestra
exports.getGymReviews = (req, res) => {
  const sql = `
    SELECT r.rating, r.review, r.date, u.full_name 
    FROM gym_reviews r
    JOIN users u ON r.customer_id = u.id
    ORDER BY r.date DESC
    LIMIT 5 
  `;
  db.all(sql, [], (err, reviews) => {
    if (err) {
      console.error("Errore nel recuperare le recensioni:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(reviews);
  });
};