const getToken = (authorization) => {
    try {
      const token = authorization.split("Bearer ")[1];
      return token
    } catch (error) {
      throw { code: 401, message: 'Falta el token' }
    }
  };
  
  module.exports = { getToken };