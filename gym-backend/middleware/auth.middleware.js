const jwt = require('jsonwebtoken');

// Guardiano 1: Controlla solo se l'utente è loggato
exports.isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.id, role: decodedToken.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Autenticazione fallita.' });
  }
};

// Guardiano 2: Controlla se l'utente è un admin 
exports.isAdmin = (req, res, next) => {
  if (req.userData && req.userData.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accesso negato. Riservato agli amministratori." });
  }
};


// Guardiano 3: Controlla se l'utente è un PT 
exports.isPT = (req, res, next) => {
  if (req.userData && req.userData.role === 'PT') {
    next();
  } else {
    res.status(403).json({ message: 'Accesso negato. Riservato ai PT.' });
  }
};