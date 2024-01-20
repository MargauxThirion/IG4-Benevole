const express = require('express');
const router = express.Router();

const flexibleCtrl = require('../controllers/flexible');

router.post('/', flexibleCtrl.createFlexible);
router.get('/benevole/:id', flexibleCtrl.getFlexibleByBenevole);
router.get('/:id', flexibleCtrl.getOneFlexible);
router.get('/', flexibleCtrl.getAllFlexible);

module.exports = router;