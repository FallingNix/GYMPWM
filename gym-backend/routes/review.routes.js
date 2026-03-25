const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { isAuth } = require('../middleware/auth.middleware');

// Rotta PUBBLICA per vedere le recensioni
router.get('/', reviewController.getGymReviews);

// Rotta PROTETTA per creare una nuova recensione
router.post('/', isAuth, reviewController.createGymReview);

module.exports = router;