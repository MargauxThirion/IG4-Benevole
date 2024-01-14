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
router.get('/:id', zoneCtrl.getOneZone);
router.get('/', zoneCtrl.getAllZone);
module.exports = router;