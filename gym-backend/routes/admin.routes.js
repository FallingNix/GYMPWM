const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

const { isAuth, isAdmin } = require('../middleware/auth.middleware');


router.get('/users/role', [isAuth], adminController.getUsersByRole);
router.post('/assign-trainer', [isAuth, isAdmin], adminController.assignTrainer);
router.delete('/unassign-trainer/:customer_id', [isAuth, isAdmin], adminController.unassignTrainer);


module.exports = router;