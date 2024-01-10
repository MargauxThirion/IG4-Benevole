const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const zoneCtrl = require('../controllers/zone');

router.post('/addJeux', upload.single('file'), zoneCtrl.addJeuxToZone);
router.post('/addHoraires', zoneCtrl.addHorairesToZone);
router.post('/', upload.single('file'), zoneCtrl.importZoneFromExcel);
router.get('/:id', zoneCtrl.getOneZone);
router.get('/', zoneCtrl.getAllZone);
router.put('/:id', zoneCtrl.modifyZone);
router.delete('/:id', zoneCtrl.deleteZone);

module.exports = router;