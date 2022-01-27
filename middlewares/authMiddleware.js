const jwt = require("jsonwebtoken");
const { User } = require("../db/authModel");

const authMiddelware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Please provide a token" });
  }

  const [, token] = authorization.split(" ");
  const user = jwt.decode(token, process.env.JWT_SECRET);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const u = await User.findById(user._id);

  req.token = token;
  req.user = u;
  req.id = user._id;
  next();
};

module.exports = {
  authMiddelware,
};
