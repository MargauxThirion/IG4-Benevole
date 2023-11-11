const express = require('express');
const router = express.Router();

const standCtrl = require('../controllers/stand');

router.post('/', standCtrl.createStand);
router.get('/:id', standCtrl.getOneStand);
router.get('/', standCtrl.getAllStand);
router.put('/:id', standCtrl.modifyStand);
router.delete('/:id', standCtrl.deleteStand);

module.exports = router;