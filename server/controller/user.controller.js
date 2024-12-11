const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { User, validate } = require("../models/user");
const TokenModel = require("../models/token");
const sendEmail = require("../utils/send.mail");
const { createSecretToken } = require("../utils/secret.token");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Either email or password is incorrect",
        success: false,
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        message: "Either email or password is incorrect",
        success: false,
      });
    }

    if (user.verified === false) {
      let token = await TokenModel.findOne({ userId: user._id });
      if (!token) {
        token = await new TokenModel({
          useId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `http://localhost:5000/api/v1/${user._id}/verify/${token.token}`;
        await sendEmail(
          user.email,
          "Verify Email",
          `Hello ${user.firstname}, Please verify your email by clicking on the link below: \n\n ${url}`
        );
      }
      return res.status(400).json({
        message: "An email was sent to your account please verify",
        success: false,
      });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });
    res.status(200).json({
      message: "Login Successfully",
      success: true,
      token: token,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      details: error.message,
      success: false,
    });
  }
};

const Signup = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    //checks if user already existed
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already existed", success: false });
    }

    //hash the password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    //create user
    user = await new User({
      ...req.body,
      password: encryptedPassword,
      verified: false,
    }).save();

    //create verification token
    const verificationToken = await new TokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `http://localhost:5000/api/v1/${user._id}/verify/${verificationToken.token}`;

    await sendEmail(
      user.email,
      "Verify Email",
      `Hello ${user.firstname}, Please verify your email by clicking on the link below: \n\n ${url}`
    );

    res.status(201).send({
      message: "An Email was sent to your account please verify",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      details: error.message,
      success: false,
    });
  }
};

const Verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ message: "Invalid Link" });
    }

    const verificationToken = await TokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!verificationToken) {
      return res.status(400).json({ message: "test" });
    }

    await User.updateOne({ _id: user._id }, { $set: { verified: true } });

    await TokenModel.deleteOne({ _id: verificationToken._id });

    // Step 5: Send success response
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying user",
      details: error.message,
      success: false,
    });
  }
};

const Home = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "user Not Found", success: false });
    }

    res.status(200).json({
      message: "homepage",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying user",
      details: error.message,
      success: false,
    });
  }
};

module.exports = { Signup, Verify, Login, Home };
