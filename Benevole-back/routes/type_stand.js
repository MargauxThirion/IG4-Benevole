const express = require('express');
const router = express.Router();

const type_standCtrl = require('../controllers/type_stand');

router.post('/', type_standCtrl.createTypeStand);
router.get('/:id', type_standCtrl.getOneTypeStand);
router.get('/', type_standCtrl.getAllTypeStand);
router.put('/:id', type_standCtrl.modifyTypeStand);
router.delete('/:id', type_standCtrl.deleteTypeStand);

module.exports = router;
