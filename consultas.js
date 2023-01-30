const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  allowExitOnIdle: true
});

const registrarUsuario = async (usuario) => {
    try{
        let { email, password, rol, lenguage } = usuario;
        console.log(email, password, rol, lenguage)
        const passwordEncriptada = bcrypt.hashSync(password);
        console.log("passwordEncriptada", passwordEncriptada)
        const values = [email, passwordEncriptada, rol, lenguage];
        const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
        await pool.query(consulta, values);
    }catch(e){
      console.log(e)  
    }
};

const getUsuario = async (email) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);
    if (!rowCount) {
        throw { code: 404, message: "Email no registrado" };
    }
    return usuario;
};

const verificaCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);
    const { password: passwordEncriptada } = usuario;
    const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordCorrecta || !rowCount) {
        throw { code: 401, message: "Email o clave incorrecta" };
    }
};

module.exports = { registrarUsuario, getUsuario, verificaCredenciales };