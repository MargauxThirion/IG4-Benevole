const express = require('express');
const router = express.Router();

const animationCtrl = require('../controllers/benevole');

router.post('/', animationCtrl.createBenevole);
router.get('/:id', animationCtrl.getOneBenevole);
router.put('/:id', animationCtrl.modifyBenevole);
router.delete('/:id', animationCtrl.deleteBenevole);
router.get('/', animationCtrl.getAllBenevole);
router.get('/referent', animationCtrl.getAllReferent);

module.exports = router;