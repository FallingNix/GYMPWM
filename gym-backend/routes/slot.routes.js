const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot.controller');
const { isAuth , isPT } = require('../middleware/auth.middleware');

router.use(isAuth);

router.get('/my-slots', [isAuth, isPT], slotController.getMySlots);
router.get('/:trainerId', [isAuth], slotController.getSlotsByTrainer);
router.post('/', [isAuth, isPT], slotController.createSlot);
router.delete('/:slotId', [isAuth, isPT], slotController.deleteSlot);


module.exports = router;