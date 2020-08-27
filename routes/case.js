const express = require('express');
const caseController = require('./../controllers/case');
const authController = require('../controllers/auth');

const router = express.Router();

// router.param('id', caseController.checkID);
router
    .route('/')
    .get(authController.requireToken, caseController.getCasesBetweenYears)
    .get(authController.requireToken, caseController.getCasesByCodes)
    .get(authController.requireToken, caseController.getAllCases)
    .post(authController.protectedRoute, caseController.createCase);

router
    .route('/:id')
    .get(authController.requireToken, caseController.getCase)
    .patch(authController.protectedRoute, caseController.updateCase)
    .delete(
        authController.protectedRoute,
        authController.restrictTo('admin'),
        caseController.deleteCase
    );

module.exports = router;