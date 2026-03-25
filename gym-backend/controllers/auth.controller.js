const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Funzione per registrare un nuovo utente (con transazione)
exports.register = async (req, res) => {
  const { username, email, full_name, phone, password, role, verificationCode } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Per favore, fornisci tutti i campi richiesti." });
  }

  // CONTROLLO DEL CODICE DI VERIFICA 
  if (role === 'PT' && verificationCode !== process.env.PT_SECRET_CODE) {
    return res.status(403).json({ message: "Codice di verifica per PT non valido." });
  }
  if (role === 'admin' && verificationCode !== process.env.ADMIN_SECRET_CODE) {
    return res.status(403).json({ message: "Codice di verifica per Admin non valido." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, existingUser) => {
      if (err) {
        console.error("Errore durante la verifica utente:", err);
        return res.status(500).json({ message: "Errore del server." });
      }
      if (existingUser) {
        return res.status(400).json({ message: "Username o email già in uso." });
      }

      // Inizia la transazione
      db.serialize(() => {
        db.run('BEGIN TRANSACTION;');

        const userSql = 'INSERT INTO users (username, email, full_name, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(userSql, [username, email, full_name, phone, hashedPassword, role], function(err) {
          if (err) {
            db.run('ROLLBACK;');
            console.error("Errore durante la registrazione (users):", err);
            return res.status(500).json({ message: "Errore del server durante la registrazione." });
          }
          const userId = this.lastID;

          if (role === 'PT') {
            db.run('INSERT INTO trainers (user_id) VALUES (?)', [userId], handleTransaction);
          } else if (role === 'utente') {
            db.run('INSERT INTO customers (user_id, join_date) VALUES (?, ?)', [userId, new Date().toISOString()], handleTransaction);
          } else {
            handleTransaction(null);
          }

          function handleTransaction(err) {
            if (err) {
              db.run('ROLLBACK;');
              console.error("Errore durante la registrazione (ruoli):", err);
              return res.status(500).json({ message: "Errore del server durante la registrazione." });
            }
            db.run('COMMIT;');
            res.status(201).json({ message: "Utente registrato con successo!", userId: userId });
          }
        });
      });
    });
  } catch (hashError) {
    console.error("Errore durante l'hashing della password:", hashError);
    return res.status(500).json({ message: "Errore del server." });
  }
};

// Funzione per il login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username e password richiesti." });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], async (err, user) => {
    if (err) {
      console.error("Errore durante il login:", err);
      return res.status(500).json({ message: "Errore del server durante il login." });
    }
    if (!user) {
      return res.status(401).json({ message: "Credenziali non valide." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Credenziali non valide." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login effettuato con successo!",
      accessToken: token
    });
  });
};

// Funzione per il logout
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout effettuato con successo." });
};