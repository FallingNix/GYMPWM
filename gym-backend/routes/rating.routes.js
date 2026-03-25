const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { isAuth } = require('../middleware/auth.middleware');


router.use(isAuth);

router.post('/',isAuth, ratingController.createRating);
router.get('/trainer/:trainerId', isAuth, ratingController.getRatingsForTrainer);
router.delete('/:ratingId',isAuth, ratingController.deleteRating);

module.exports = router;