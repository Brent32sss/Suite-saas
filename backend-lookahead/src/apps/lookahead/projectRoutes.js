const express = require('express');
const router = express.Router();
const { getProyectosPorUsuario } = require('./projectController'); 

// Cuando el frontend pida GET /api/proyectos/csuarez, se ejecutará el controlador
router.get('/:codigo', getProyectosPorUsuario);

module.exports = router;