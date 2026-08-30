const express = require('express');
const router = express.Router();
const { login } = require('./authcontroller'); 

// Cuando el frontend mande un POST a /api/auth/login, ejecuta el controlador
router.post('/login', login);

module.exports = router;