const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const zoneCtrl = require('../controllers/zoneBenevole');

router.post('/addJeux', upload.single('file'), zoneCtrl.addJeuxToZone);
router.post('/addHoraires', zoneCtrl.addHorairesToZone);
router.post('/jour1', upload.single('file'), zoneCtrl.importZoneFromExcelJour1);
router.post('/jour2', upload.single('file'), zoneCtrl.importZoneFromExcelJour2);
router.get('/date/both', zoneCtrl.getZoneByBothDate);
router.get('/date/:date', zoneCtrl.getZonesByDate);
router.get('/jeu/:jeuId', zoneCtrl.trouverZoneParJeuId);
router.get('/:id', zoneCtrl.getOneZone);
router.get('/', zoneCtrl.getAllZone);
router.put('/participer/:idHoraire/:idBenevole', zoneCtrl.addBenevoleToHoraire);
router.put('/referent/:idZoneBenevole/:benevoleId', zoneCtrl.addReferentToZoneBenevole);
router.put('/:id', zoneCtrl.modifyZone);
router.delete('/removeReferent/:idZoneBenevole/:referentId', zoneCtrl.removeReferentFromZoneBenevole);
router.delete('/:id', zoneCtrl.deleteZone);
router.get('/:idZone/jeux', zoneCtrl.getJeuxByZone);

module.exports = router;