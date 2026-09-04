require('dotenv').config();
const sql = require('mssql');
const bcrypt = require('bcrypt');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: false, trustServerCertificate: true }
};

const updatePassword = async () => {
    try {
        await sql.connect(dbConfig);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Azurlane@1', salt);

        await new sql.Request()
            .input('codigo', sql.VarChar, 'csuarez')
            .input('hash', sql.VarChar, hashedPassword)
            .query(`UPDATE [sistema_lookahead].[dbo].[usuarios] SET password_hash = @hash WHERE codigo = @codigo`);

        console.log("✅ Contraseña de csuarez encriptada exitosamente");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

updatePassword();