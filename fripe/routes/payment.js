const express = require('express');
const router = express.Router();
const { Add, verify } = require('../controllers/payment');

router.post('/payment', Add);
router.post('/payment/:id', verify);








module.exports = router;