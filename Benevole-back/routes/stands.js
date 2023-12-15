const express = require('express');
const router = express.Router();

const standCtrl = require('../controllers/stands');

router.post('/', standCtrl.createStands);
router.get('/:id', standCtrl.getOneStands);
router.get('/', standCtrl.getAllStands);
router.put('/:id', standCtrl.modifyStands);
router.put('/participer/:idHoraire/:idBenevole', standCtrl.addBenevoleToHoraire);
router.put('/referent/:idStand/:idBenevole', standCtrl.addReferentToStand);
router.delete('/:id', standCtrl.deleteStands);

module.exports = router;