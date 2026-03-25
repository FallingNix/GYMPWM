const express = require('express');
const router = express.Router();
const planController = require('../controllers/plan.controller');
const { isAuth, isPT, isAdmin } = require('../middleware/auth.middleware');


router.post('/', [isAuth, isPT], planController.createPlan);
router.get('/my-created-plans', [isAuth, isPT], planController.getMyPlans);
router.get('/my-assigned-plans', [isAuth], planController.getAssignedPlansForCustomer);
router.get('/:planId', [isAuth], planController.getPlanDetails);
router.delete('/:planId', [isAuth], planController.deletePlan);


module.exports = router;