const express = require('express');
const router = express.Router();

const festivalCtrl = require('../controllers/festival');

router.post('/', festivalCtrl.createFestival);
router.get('/:id', festivalCtrl.getOneFestival);
router.get('/', festivalCtrl.getAllFestival);
router.put('/:id', festivalCtrl.modifyFestival);
router.delete('/:id', festivalCtrl.deleteFestival);

module.exports = router;