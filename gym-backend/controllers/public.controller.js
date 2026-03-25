const db = require('../db');

exports.getTopRatedTrainers = (req, res) => {
  const sql = `
    SELECT 
      u.id, 
      u.full_name, 
      t.specialization,
      AVG(r.rating) as average_rating,
      COUNT(r.id) as review_count
    FROM users u
    JOIN trainers t ON u.id = t.user_id
    LEFT JOIN ratings r ON u.id = r.trainer_id
    WHERE u.role = 'PT'
    GROUP BY u.id
    ORDER BY average_rating DESC, review_count DESC
    LIMIT 3
  `;
  
  db.all(sql, [], (err, trainers) => {
    if (err) {
      console.error("Errore nel recuperare i top trainer:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(trainers);
  });
};