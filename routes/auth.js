// path: api/login

const { Router, response, request } = require("express");
const { body } = require("express-validator");
const { createUser, login, renewToken } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();

router.post(
  "/new",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Email is requred").not().isEmpty(),
    body("email").isEmail(),
    body("password", "Passwors is required").not().isEmpty(),
    body("password", "At least 6 characters are required").isLength({ min: 6 }),
    validateFields,
  ],
  createUser
);

router.post("/", [
  body("email", "Mail is required").not().isEmpty(),
  body("email").isEmail(),
  body("password").not().isEmpty(),
  validateFields
],
login
);

router.get("/renew", validateJWT, renewToken );

module.exports = router;
