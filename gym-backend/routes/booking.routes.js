const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

const { isAuth } = require('../middleware/auth.middleware');


router.use(isAuth);

router.post('/', bookingController.createBooking);
router.get('/me', bookingController.getMyBookings);
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;