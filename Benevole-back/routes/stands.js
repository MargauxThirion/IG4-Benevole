const express = require('express');
const router = express.Router();

const standCtrl = require('../controllers/stands');

router.post('/', standCtrl.createStands);
router.get('/date/both', standCtrl.getStandBothDate);
router.get('/date/:date', standCtrl.getStandsByDate);
router.get('/benevole/:id', standCtrl.getStandsByBenevole);
router.get('/referent/:id', standCtrl.getStandsByReferent);
router.get('/:id', standCtrl.getOneStands);
router.get('/', standCtrl.getAllStands);
router.put('/:id', standCtrl.modifyStands);
router.put('/participer/:idHoraire/:idBenevole', standCtrl.addBenevoleToHoraire);
router.put('/inscrire/:standId/:horaire/:idBenevole', standCtrl.addFlexibleToStand);
router.put('/referent/:idStand/:idBenevole', standCtrl.addReferentToStand);
router.delete('/:id', standCtrl.deleteStand);
router.delete('/removeReferent/:standId/:referentId', standCtrl.removeReferentFromStand);
router.delete('/removeBenevole/:idHoraire/:idBenevole', standCtrl.removeBenevoleFromStand);

module.exports = router;