const express = require('express');
const router = express.Router();

const accueilCtrl = require('../controllers/accueil');

router.post('/', accueilCtrl.createAccueil);
router.get('/:id', accueilCtrl.getOneAccueil);
router.get('/', accueilCtrl.getAllAccueil);
router.put('/:id', accueilCtrl.modifyAccueil);
router.delete('/:id', accueilCtrl.deleteAccueil);

module.exports = router;