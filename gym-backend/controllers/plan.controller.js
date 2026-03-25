const db = require('../db');

// Funzione per creare una scheda
exports.createPlan = (req, res) => {
  const { name, description, exercise_ids, customer_id } = req.body;
  const ownerId = req.userData.userId;

  if (!name || !exercise_ids || exercise_ids.length === 0) {
    return res.status(400).json({ message: "Nome e almeno un esercizio sono richiesti." });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');

    const planSql = 'INSERT INTO workout_plans (name, description, owner_id) VALUES (?, ?, ?)';
    db.run(planSql, [name, description, ownerId], function (err) {
      if (err) {
        db.run('ROLLBACK;');
        console.error("Errore nella creazione della scheda:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      
      const planId = this.lastID;
      const assocStmt = db.prepare('INSERT INTO plan_exercise_association (plan_id, exercise_id) VALUES (?, ?)');
      for (const exerciseId of exercise_ids) {
        assocStmt.run(planId, exerciseId);
      }
      assocStmt.finalize((err) => {
        if (err) {
            db.run('ROLLBACK;');
            console.error("Errore nell'associare gli esercizi:", err);
            return res.status(500).json({ message: "Errore del server." });
        }

        if (customer_id) {
          const assignSql = 'INSERT INTO customer_plan_assignments (customer_user_id, plan_id) VALUES (?, ?)';
          db.run(assignSql, [customer_id, planId], (err) => {
             if (err) {
                db.run('ROLLBACK;');
                console.error("Errore nell'assegnare la scheda:", err);
                return res.status(500).json({ message: "Errore del server." });
            }
            db.run('COMMIT;');
            res.status(201).json({ message: "Scheda creata e assegnata con successo!", planId });
          });
        } else {
            db.run('COMMIT;');
            res.status(201).json({ message: "Scheda creata con successo!", planId });
        }
      });
    });
  });
};

// Funzione per un PT per ottenere le schede che ha creato
exports.getMyPlans = (req, res) => {
  const ownerId = req.userData.userId;
  db.all('SELECT * FROM workout_plans WHERE owner_id = ?', [ownerId], (err, plans) => {
    if (err) {
      console.error("Errore nel recuperare le schede create:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(plans);
  });
};

// Funzione per un UTENTE per ottenere le schede che gli sono state ASSEGNATE
exports.getAssignedPlansForCustomer = (req, res) => {
  const customerId = req.userData.userId;
  const sql = `
    SELECT wp.* FROM workout_plans wp
    JOIN customer_plan_assignments cpa ON wp.id = cpa.plan_id
    WHERE cpa.customer_user_id = ?
  `;
  db.all(sql, [customerId], (err, plans) => {
    if (err) {
      console.error("Errore nel recuperare le schede assegnate:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    res.status(200).json(plans);
  });
};

// Funzione per ottenere i dettagli di una singola scheda
exports.getPlanDetails = (req, res) => {
  const { planId } = req.params;
  db.get('SELECT * FROM workout_plans WHERE id = ?', [planId], (err, plan) => {
    if (err) {
      console.error("Errore nel recuperare i dettagli (plan):", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (!plan) {
      return res.status(404).json({ message: 'Scheda non trovata.' });
    }

    const sqlExercises = `
      SELECT e.* FROM exercises e
      JOIN plan_exercise_association pea ON e.id = pea.exercise_id
      WHERE pea.plan_id = ?
    `;
    db.all(sqlExercises, [planId], (err, exercises) => {
      if (err) {
        console.error("Errore nel recuperare i dettagli (exercises):", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      plan.exercises = exercises;
      res.status(200).json(plan);
    });
  });
};

// Funzione per eliminare una scheda di allenamento
exports.deletePlan = (req, res) => {
  const { planId } = req.params; 
  const { userId, role } = req.userData; 

  db.get('SELECT owner_id FROM workout_plans WHERE id = ?', [planId], (err, plan) => {
    if (err) {
      console.error("Errore nel recuperare la scheda per cancellazione:", err);
      return res.status(500).json({ message: "Errore del server." });
    }
    if (!plan) {
      return res.status(404).json({ message: "Scheda non trovata." });
    }
    if (plan.owner_id !== userId && role !== 'admin') {
      return res.status(403).json({ message: "Accesso negato. Non sei autorizzato a eliminare questa scheda." });
    }

    db.run('DELETE FROM workout_plans WHERE id = ?', [planId], function(err) {
      if (err) {
        console.error("Errore nell'eliminazione della scheda:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      res.status(200).json({ message: "Scheda di allenamento eliminata con successo." });
    });
  });
};