const express = require('express');
const cors = require("cors");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.APP_PORT || 4000;

//const reporteria
const {reportQuery} = require('./middlewares/logger');
const { registrarUsuario, getUsuario, verificaCredenciales} = require('./consultas');
const { checkCredencialesOK, verificatoken } = require ('./middlewares/middleware')

app.use(express.json()); //middleware 
app.use(cors());

//
app.post('/usuarios',  async (req, res) => {
  try {
    const user = req.body;
    await registrarUsuario(user);
    res.send('Usuario registrado con éxito');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/usuarios",reportQuery, verificatoken, async (req,res)=>{
  try{
      const token = req.header("authorization").split("Bearer ")[1]
      const { email } = jwt.decode(token)
      const usuario = await getUsuario (email)
      res.json(usuario)
  } catch (error) {
      console.log(error)
      const { code, message } = error
      res.status(code).send(message)
  }
})

app.post("/login", checkCredencialesOK, reportQuery,async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificaCredenciales (email, password);
    const token = jwt.sign({ email }, process.env.SECRET_KEY);
    res.send(token);
  } catch ({ code,message }) {
    console.log(message);
    res.status(error.code || 500).send(message);
  }
});

app.listen(PORT, () => {
  console.log(`Estoy escuchando el puerto ${PORT}`);
});
