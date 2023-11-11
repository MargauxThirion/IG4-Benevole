const express = require('express');
const router = express.Router();

const standCtrl = require('../controllers/stands');

router.post('/', standCtrl.createStands);
router.get('/:id', standCtrl.getOneStands);
router.get('/', standCtrl.getAllStands);
router.put('/:id', standCtrl.modifyStands);
router.delete('/:id', standCtrl.deleteStands);

module.exports = router;