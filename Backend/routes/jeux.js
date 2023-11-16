const express = require('express');
const router = express.Router();

const typeStandCtrl = require('../controllers/jeux');

router.post('/', typeStandCtrl.createJeux);
router.get('/:id', typeStandCtrl.getOneJeux);
router.put('/:id', typeStandCtrl.modifyJeux);
router.delete('/:id', typeStandCtrl.deleteJeux);
router.get('/', typeStandCtrl.getAllJeux);

module.exports = router;