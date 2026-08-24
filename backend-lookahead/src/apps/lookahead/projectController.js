const sql = require('mssql');

const getProyectosPorUsuario = async (req, res) => {
    try {
        const { codigo } = req.params; 

        const request = new sql.Request();
        const result = await request
            .input('codigo', sql.VarChar, codigo)
            .query(`
                SELECT p.codigo, p.nombre, p.sheets_id, p.ubicacion, p.fecha_inicio
                FROM [sistema_lookahead].[dbo].[proyectos] p
                INNER JOIN [sistema_lookahead].[dbo].[usuarios_proyectos] up ON p.id = up.id_proyecto
                INNER JOIN [sistema_lookahead].[dbo].[usuarios] u ON u.id = up.id_usuario
                WHERE LOWER(u.codigo) = LOWER(@codigo) AND p.estado = 'ACTIVO'
            `);
        
        // Devolvemos el resultado (incluso si viene vacío [])
        res.status(200).json(result.recordset);
        
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error interno al cargar los proyectos' });
    }
};

module.exports = {
    getProyectosPorUsuario
};