const sql = require('mssql');

const login = async (req, res) => {
    try {
        const { usuario, password } = req.body; 

        const request = new sql.Request();
        
        // Mapeo exacto según tu tabla: email, password_hash y codigo
        const result = await request
            .input('usuario', sql.VarChar, usuario)
            .input('password', sql.VarChar, password)
            .query(`
                SELECT id, codigo, nombre, rol 
                FROM [sistema_lookahead].[dbo].[usuarios] 
                WHERE (codigo = @usuario OR email = @usuario) 
                  AND password_hash = @password 
                  AND estado = 'ACTIVO'
            `);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    login
};