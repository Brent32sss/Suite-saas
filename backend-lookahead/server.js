require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

// 1. IMPORTAMOS LAS RUTAS DESDE LAS NUEVAS CARPETAS
const authRoutes = require('./src/core/auth/authroutes');
const projectRoutes = require('./src/apps/lookahead/projectRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Conectar y arrancar
sql.connect(dbConfig).then(() => {
    console.log("✅ Conectado a la base de datos SQL Server exitosamente.");
    
    // 2. ACTIVAMOS LAS RUTAS EN EL SERVIDOR
    app.use('/api/auth', authRoutes);
    app.use('/api/proyectos', projectRoutes); 
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Error fatal al conectar con SQL Server:", err.message);
});