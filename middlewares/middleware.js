const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getToken } = require('../obtenertoken');
//const { secretKey } = require ("./secretKey")

const checkCredencialesOK = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { code: 401, message: "falta llenar datos"};
      }
      next();
    } catch (error) {
      res.status(error.code || 500).send(error);
    }
  };

  const verificatoken = async (req, res, next) => {
	try {
		const token = getToken(req.header("Authorization"));
		jwt.verify(token, process.env.SECRET_KEY);
		next();
	} catch (error) {
		res.status(error.code || 498).send(error);
	}
};

  module.exports = { checkCredencialesOK, verificatoken };