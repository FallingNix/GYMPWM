const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');


router.get('/trainers/top-rated', publicController.getTopRatedTrainers);

module.exports = router;