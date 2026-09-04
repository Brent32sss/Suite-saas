const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { usuario, password } = req.body; 

        const request = new sql.Request();
        
        // Mapeo exacto según tu tabla: traemos el password_hash de la BD para compararlo aquí
        const result = await request
            .input('usuario', sql.VarChar, usuario)
            .query(`
                SELECT id, codigo, nombre, rol, password_hash 
                FROM [sistema_lookahead].[dbo].[usuarios] 
                WHERE (codigo = @usuario OR email = @usuario) 
                  AND estado = 'ACTIVO'
            `);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            // Verificamos si la contraseña coincide con el hash
            const validPassword = await bcrypt.compare(password, user.password_hash);

            if (validPassword) {
                // Generamos el Token
                const token = jwt.sign(
                    { id: user.id, codigo: user.codigo, rol: user.rol },
                    process.env.JWT_SECRET,
                    { expiresIn: '8h' }
                );

                // Retornamos el token y los datos del usuario (sin enviar el hash por seguridad)
                res.status(200).json({
                    token,
                    user: {
                        id: user.id,
                        codigo: user.codigo,
                        nombre: user.nombre,
                        rol: user.rol
                    }
                });
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
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