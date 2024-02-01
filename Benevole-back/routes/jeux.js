const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const jeuxCtrl = require('../controllers/jeux');


router.post('/upload', upload.single('file'), jeuxCtrl.importJeuxFromExcel);
router.get('/nom/:nom', jeuxCtrl.getJeuByNom);
router.get('/search', jeuxCtrl.searchJeux);
router.get('/:id', jeuxCtrl.getOneJeu);
router.put('/:id', jeuxCtrl.modifyJeu);
router.delete('/:id', jeuxCtrl.deleteJeu);
router.get('/', jeuxCtrl.getAllJeu);

module.exports = router;