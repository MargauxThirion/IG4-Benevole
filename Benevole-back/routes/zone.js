const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const zoneCtrl = require('../controllers/zone');

router.post('/addJeux', upload.single('file'), zoneCtrl.addJeuxToZone);
router.post('/addHoraires', zoneCtrl.addHorairesToZone);
router.post('/jour1', upload.single('file'), zoneCtrl.importZoneFromExcelJour1);
router.post('/jour2', upload.single('file'), zoneCtrl.importZoneFromExcelJour2);
router.get('/date/:date', zoneCtrl.getZonesByDate);
router.get('/:id', zoneCtrl.getOneZone);
router.get('/', zoneCtrl.getAllZone);
router.put('/addBenevole/:idHoraire/:idBenevole', zoneCtrl.addBenevoleToHoraire);
router.put('/referent/:idZone/:idBenevole', zoneCtrl.addReferentToZone);
router.put('/:id', zoneCtrl.modifyZone);
router.delete('/removeReferent/:zoneId/:referentId', zoneCtrl.removeReferentFromZone);
router.delete('/:id', zoneCtrl.deleteZone);

module.exports = router;