const express = require('express');
const router = express.Router();

const zoneCtrl = require('../controllers/zone');

router.post('/addJeux', zoneCtrl.addJeuxToZone);
router.post('/', zoneCtrl.importZoneFromExcel);
router.get('/:id', zoneCtrl.getOneZone);
router.get('/', zoneCtrl.getAllZone);
router.put('/:id', zoneCtrl.modifyZone);
router.delete('/:id', zoneCtrl.deleteZone);

module.exports = router;