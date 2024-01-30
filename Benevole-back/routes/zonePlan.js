const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const zoneCtrl = require('../controllers/zonePlan');

router.post('/addJeux', upload.single('file'), zoneCtrl.addJeuxToZone);
router.post('/addHoraires', zoneCtrl.addHorairesToZone);
router.post('/jour1', upload.single('file'), zoneCtrl.importZoneFromExcelJour1);
router.post('/jour2', upload.single('file'), zoneCtrl.importZoneFromExcelJour2);
router.get('/zoneBenevole/:zonePlanId', zoneCtrl.getNomsZonesBenevoles);
router.get('/date/:date', zoneCtrl.getZonesByDate);
router.get('/:id', zoneCtrl.getOneZone);
router.get('/', zoneCtrl.getAllZone);
router.put('/participer/:idHoraire/:idBenevole', zoneCtrl.addBenevoleToHoraire);
router.put('/referent/:zonePlanId/:benevoleId', zoneCtrl.addReferentToZonePlan);
router.put('/:id', zoneCtrl.modifyZonePlan);
router.delete('/removeReferent/:zonePlanId/:referentId', zoneCtrl.removeReferentFromZonePlan);

module.exports = router;