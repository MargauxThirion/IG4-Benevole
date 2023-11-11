const express = require('express');
const router = express.Router();

const animationCtrl = require('../controllers/animation');

router.post('/', animationCtrl.createAnimation);
router.get('/:id', animationCtrl.getOneAnimation);
router.get('/', animationCtrl.getAllAnimation);
router.put('/:id', animationCtrl.modifyAnimation);
router.delete('/:id', animationCtrl.deleteAnimation);

module.exports = router;