const jwt = require("jsonwebtoken");

const   generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.JWT_key,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          // no se pudo crear el token
          reject('Failed to generate token')
        } else {
          // TOKEN
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
