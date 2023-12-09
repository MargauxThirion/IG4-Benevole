const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const benevoleCtrl = require('../controllers/benevole');

router.post('/signup', benevoleCtrl.signup);
router.post('/login', benevoleCtrl.login);
router.get('/:pseudo', benevoleCtrl.getBenevole);
// router.put('/:id', benevoleCtrl.modifyBenevole);
// router.delete('/:id', benevoleCtrl.deleteBenevole);
//router.get('/referent', benevoleCtrl.getAllBenevoleReferent);
//router.get('/', benevoleCtrl.getAllBenevole);
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Accès autorisé à la ressource protégée' });
  });

module.exports = router;
