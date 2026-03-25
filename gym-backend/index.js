const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db'); 

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());


function initializeDatabase() {

  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, table) => {
    if (err) {
      console.error("Errore nel controllare il database:", err.message);
      return;
    }
    

    if (!table) {
      console.log('Tabella "users" non trovata. Inizio creazione e popolamento del database...');
      
      const setupSQL = fs.readFileSync(path.resolve(__dirname, 'database_setup.sql'), 'utf8');
      
      db.exec(setupSQL, (err) => {
        if (err) {
          console.error("ERRORE: Impossibile eseguire lo script di setup del database:", err.message);
        } else {
          console.log('Database e tabelle create con successo. Il sistema è pronto.');
        }
      });
    } else {
        console.log('Database e tabelle già presenti. Nessuna azione richiesta.');
    }
  });
}




const authRoutes = require('./routes/auth.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const planRoutes = require('./routes/plan.routes');
const slotRoutes = require('./routes/slot.routes');
const bookingRoutes = require('./routes/booking.routes');
const ratingRoutes = require('./routes/rating.routes'); 
const adminRoutes = require('./routes/admin.routes'); 
const userRoutes = require('./routes/user.routes');
const publicRoutes = require('./routes/public.routes');
const reviewRoutes = require('./routes/review.routes'); 


app.use('/api', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ratings', ratingRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);


app.get('/api/test-connection', (req, res) => {
  res.json({ message: "Backend e Frontend sono collegati con successo!" });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server Node.js in ascolto su http://localhost:${PORT}`);
  initializeDatabase();
});