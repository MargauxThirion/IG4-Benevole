const express = require('express');
const router = express.Router();

const benevoleCtrl = require('../controllers/benevole');

router.post('/', benevoleCtrl.createBenevole);
router.get('/id/:id', benevoleCtrl.getOneBenevole);
router.put('/:id', benevoleCtrl.modifyBenevole);
router.delete('/:id', benevoleCtrl.deleteBenevole);
router.get('/referent', benevoleCtrl.getAllBenevoleReferent);
router.get('/', benevoleCtrl.getAllBenevole);

module.exports = router;