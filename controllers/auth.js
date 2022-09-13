const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const e = require("express");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res
        .status(400)
        .json({ ok: false, msg: "An account already exists with this email" });
    }

    const user = new User(req.body);

    //? Encriptar clave.
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    //? Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      msg: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        msg: "Username does not exist",
      });
    }

    //* Validar el password.
    const validatePass = bcrypt.compareSync(password, userDB.password);

    if (!validatePass) {
      return res.status(404).json({
        msg: "invalid password",
      });
    }

    //* Generamos el JWT.
    const token = await generateJWT(userDB.id);

    return res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk to the administrator",
    });
  }
};

const renewToken = async (req, res = response) => {
  //! uid del usuario
  const uid = req.uid;

  //? Genera el token
  const token = await generateJWT(uid);

  //? devuelve el usuario
  const user = await User.findById(uid);

  //* Generar nuevo token

  res.json({
    ok: true,
    user,
    token,
  });
};

module.exports = {
  createUser,
  login,
  renewToken,
};
