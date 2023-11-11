const express = require('express');
const router = express.Router();

const typeStandCtrl = require('../controllers/type_stand');

router.post('/', typeStandCtrl.createTypeStand);
router.get('/:id', typeStandCtrl.getOneTypeStand);
router.get('/', typeStandCtrl.getAllTypeStand);
router.put('/:id', typeStandCtrl.modifyTypeStand);
router.delete('/:id', typeStandCtrl.deleteTypeStand);

module.exports = router;