const db = require('../db');

// Funzione per creare un nuovo esercizio
exports.createExercise = (req, res) => {
  const { name, description, muscle_group, video_url } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Il nome dell'esercizio è obbligatorio." });
  }

  const sql = 'INSERT INTO exercises (name, description, muscle_group, video_url) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, description, muscle_group, video_url], function(err) {
    if (err) {
      console.error("Errore nella creazione dell'esercizio:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(201).json({ id: this.lastID, name, description, muscle_group, video_url });
  });
};

// Funzione per ottenere tutti gli esercizi
exports.getAllExercises = (req, res) => {
  db.all('SELECT * FROM exercises', [], (err, exercises) => {
    if (err) {
      console.error("Errore nel recuperare gli esercizi:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(exercises);
  });
};

// Funzione per eliminare un esercizio
exports.deleteExercise = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM exercises WHERE id = ?', [id], function(err) {
    if (err) {
      console.error("Errore nell'eliminare l'esercizio:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Esercizio non trovato." });
    }
    res.status(200).json({ message: "Esercizio eliminato con successo." });
  });
};