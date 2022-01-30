const e = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { User } = require("../db/authModel");
// const { getMaxListeners } = require("../app");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");

const registration = async (body) => {
  const { email, password } = body;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      avatarURL: gravatar.url(email, { protocol: "http", s: "100" }),
      verificationToken: uuidv4(),
    });

    await user.save();

    const msg = {
      to: email,
      from: "iuriibilonog@gmail.com",
      subject: "Please, confirm Your Email!",
      text: `Here is Your verification link - http://127.0.0.1:8083/users/verify/${user.verificationToken}`,
      html: `Here is Your verification <a href=http://127.0.0.1:8083/users/verify/${user.verificationToken}>link</a>`,
    };

    await sgMail.send(msg);

    const newUser = { email: user.email, subscription: user.subscription };
    return newUser;
  } catch (error) {
    console.log("error", error.message);
  }
};

const login = async (body) => {
  const { email, password } = body;
  try {
    const findUser = await User.findOne({ email, verify: true });

    if (!findUser) return `No user with email ${email}`;
    if (!(await bcrypt.compare(password, findUser.password)))
      return "Wrong password";

    const token = jwt.sign(
      {
        _id: findUser._id,
      },
      process.env.JWT_SECRET
    );
    await User.updateOne({ _id: findUser.id }, { token });
    const user = { email, subscription: findUser.subscription, token };
    return user;
  } catch (error) {
    console.log("error", error.message);
  }
};

const logout = async (userId) => {
  try {
    const result = await User.updateOne({ _id: userId }, { token: null });
  } catch (error) {
    console.log("error", error.message);
  }
};

const current = async (userId) => {
  try {
    const user = await User.findById({ _id: userId });
    const userData = { email: user.email, subscription: user.subscription };
    return userData;
  } catch (error) {
    console.log("error", error.message);
  }
};

const confirmEmail = async (verificationToken) => {
  try {
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verificationToken: null, verify: true }
    );
    if (!user) return false;

    return user;
  } catch (error) {
    console.log("error", error.message);
  }
};

const confirmEmailSecondTime = async (email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const user = await User.findOne({ email });
    if (!user) return `No user with email ${email}`;
    if (user.verify === true) return "Verification has already been passed";
    const msg = {
      to: email,
      from: "iuriibilonog@gmail.com",
      subject: "Please, confirm Your Email!",
      text: `Here is Your verification link - http://127.0.0.1:8083/users/verify/${user.verificationToken}`,
      html: `Here is Your verification <a href=http://127.0.0.1:8083/users/verify/${user.verificationToken}>link</a>`,
    };

    await sgMail.send(msg);
    return user;
  } catch (error) {
    console.log("error", error.message);
    return false;
  }
};

module.exports = {
  registration,
  login,
  logout,
  current,
  confirmEmail,
  confirmEmailSecondTime,
};
