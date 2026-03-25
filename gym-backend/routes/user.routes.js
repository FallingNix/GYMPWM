const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAuth , isPT } = require('../middleware/auth.middleware');


router.get('/me', isAuth, userController.getCurrentUser);
router.get('/my-customers', [isAuth,isPT], userController.getAssignedClient);

module.exports = router;