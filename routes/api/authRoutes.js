const express = require("express");
const router = express.Router();
const { User } = require("../../db/authModel");

const { registration, login, logout, current } = require("../../model/auth");

const { userValidation } = require("../../middlewares/validationMiddlewares");
const { authMiddelware } = require("../../middlewares/authMiddleware");

router.post("/signup", userValidation, async (req, res, next) => {
  const allUsers = await User.find({});
  const isUnique = allUsers.filter((item) =>
    item.email.includes(req.body.email)
  );
  if (isUnique.length !== 0)
    return res.status(409).json({ message: "Email in use" });

  const user = await registration(req.body);
  res.status(201).json({ user });
});

router.post("/signin", userValidation, async (req, res, next) => {
  const result = await login(req.body);
  if (typeof result === "string")
    return res.status(401).json({ message: result });
  res.json({ user: result });
});

router.get("/logout", authMiddelware, async (req, res, next) => {
  const result = await logout(req.id);
  res.status(204).json({ message: "No Content" });
});

router.get("/current", authMiddelware, async (req, res, next) => {
  const result = await current(req.id);
  res.json({ user: result });
});

module.exports = router;