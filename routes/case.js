const express = require('express');
const caseController = require('./../controllers/case');
const authController = require('../controllers/auth');

const router = express.Router();

// router.param('id', caseController.checkID);
router
    .route('/')
    .get(authController.protectedRoute, caseController.getCasesBetweenYears)
    .get(authController.protectedRoute, caseController.getCasesByCodes)
    .get(authController.protectedRoute, caseController.getAllCases)
    .post(authController.protectedRoute, caseController.createCase);

router
    .route('/:id')
    .get(authController.protectedRoute, caseController.getCase)
    .patch(authController.protectedRoute, caseController.updateCase)
    .delete(authController.protectedRoute, caseController.deleteCase);

module.exports = router;