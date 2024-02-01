const express = require('express');
const router = express.Router();

const flexibleZoneCtrl = require('../controllers/flexibleZone');

router.post('/check', flexibleZoneCtrl.checkAndDeleteFlexible);
router.post('/', flexibleZoneCtrl.createFlexibleZone);
router.get('/benevole/:id', flexibleZoneCtrl.getFlexibleZoneByBenevole);
router.get('/:id', flexibleZoneCtrl.getOneFlexibleZone);
router.get('/', flexibleZoneCtrl.getAllFlexibleZone);
router.delete('/:idFlexibleZone/:date', flexibleZoneCtrl.removeOneFlexibleZoneById);
router.delete('/', flexibleZoneCtrl.removeAllFlexibleZone);

module.exports = router;