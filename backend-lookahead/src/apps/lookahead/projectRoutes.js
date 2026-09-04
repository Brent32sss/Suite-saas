const express = require('express');
const router = express.Router();
const { getProyectosPorUsuario } = require('./projectController'); 
const verifyToken = require('../../core/auth/middleware/authMiddleware');

router.get('/:codigo', verifyToken, getProyectosPorUsuario);

module.exports = router;