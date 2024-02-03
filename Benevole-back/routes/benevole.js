const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const benevoleCtrl = require('../controllers/benevole');

router.post('/signup', benevoleCtrl.signup);
router.post('/login', benevoleCtrl.login);
router.get('/pseudo/:pseudo', benevoleCtrl.getBenevole);
router.put('/:pseudo', benevoleCtrl.modifyBenevole);
router.get('/id/:id', benevoleCtrl.getBenevoleById);
router.get('/check-pseudo/:pseudo', benevoleCtrl.checkPseudoExists);
router.get('/non-referent', benevoleCtrl.getNonReferentBenevoles);
router.put('/promote/:id', benevoleCtrl.promoteToAdmin);
router.get('/referent', benevoleCtrl.getAllBenevoleReferent);
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Accès autorisé à la ressource protégée' });
  });

module.exports = router;