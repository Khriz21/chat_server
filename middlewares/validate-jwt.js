const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  // Leer el token.
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "The token is required",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_key);
    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "The token is not valid",
    });
  }
};

module.exports = {
  validateJWT,
};
