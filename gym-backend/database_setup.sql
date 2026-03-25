-- Tabella Utenti
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    role TEXT NOT NULL DEFAULT 'utente'
);

-- Tabella Trainers
CREATE TABLE IF NOT EXISTS trainers (
    user_id INTEGER PRIMARY KEY,
    specialization VARCHAR(100),
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabella Esercizi
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    muscle_group VARCHAR(50),
    video_url VARCHAR(255)
);

-- Tabella Schede di Allenamento
CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabella di collegamento Esercizi <-> Schede
CREATE TABLE IF NOT EXISTS plan_exercise_association (
    plan_id INTEGER,
    exercise_id INTEGER,
    PRIMARY KEY (plan_id, exercise_id),
    FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Tabella Dettagli per i Clienti
CREATE TABLE IF NOT EXISTS customers (
    user_id INTEGER PRIMARY KEY,
    join_date TEXT,
    trainer_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabella Assegnazioni Schede <-> Clienti
CREATE TABLE IF NOT EXISTS customer_plan_assignments (
    customer_user_id INTEGER,
    plan_id INTEGER,
    assignment_date TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_user_id, plan_id),
    FOREIGN KEY (customer_user_id) REFERENCES customers(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

-- Tabella Slot di Allenamento
CREATE TABLE IF NOT EXISTS training_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trainer_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    max_clients INTEGER DEFAULT 1,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabella Prenotazioni
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    booking_date TEXT,
    status VARCHAR(20) DEFAULT 'confirmed',
    FOREIGN KEY (customer_id) REFERENCES customers(user_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES training_slots(id) ON DELETE CASCADE
);

-- Tabella: Valutazioni
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    trainer_id INTEGER NOT NULL,
    rating REAL NOT NULL,
    review TEXT,
    date TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(user_id) ON DELETE CASCADE
);