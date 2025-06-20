const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const dotenv = require("dotenv");

const { User, validate } = require("../models/user");
const UserProfile = require("../models/user_profile");
const UserAchievements = require("../models/user_game_achievements");
const UserBoughtCharacters = require("../models/user_bought_characters");
const Token = require("../models/token");
const sendEmail = require("../utils/send.mail");
const { createSecretToken } = require("../utils/secret.token");
const { stat } = require("fs");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", success: false });
    }

    const user = await User.findOne({ where: { email } });
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

    if (!user.verified) {
      let token = await Token.findOne({ where: { userId: user.id } });
      if (!token) {
        token = await Token.create({
          userId: user.id,
          token: crypto.randomBytes(32).toString("hex"),
        });

        const url = `http://localhost:5000/api/v1/${user.id}/verify/${token.token}`;
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

    const token = createSecretToken(user.id);
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      httpOnly: false,
      signed: true,
    });

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      details: error.message,
      success: false,
    });
  }
};

const Signup = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false, error });
    }

    const birthdateString = req.body.birthdate;
    const birthdate = new Date(birthdateString);

    // --- Age validation start ---
    const today = new Date();
    const minAge = 3;
    const maxAge = 6;
    const age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      // Not yet had birthday this year
      age--;
    }
    if (age < minAge || age > maxAge) {
      return res.status(400).json({
        message: `Only children aged ${minAge}-${maxAge} years old can sign up.`,
        success: false,
      });
    }

    // Check if user already exists
    let existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
      },
    });

    if (existingUser) {
      const field =
        existingUser.email === req.body.email ? "Email" : "Username";
      console.log(`${field} already exists for:`, existingUser.email);
      return res
        .status(400)
        .json({ message: `${field} already exists`, success: false });
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user
    const user = await User.create({
      ...req.body,
      birthdate,
      password: encryptedPassword,
      verified: false,
    });

    //Create user achievements
    const userAchievements = await UserAchievements.create({
      profileID: user.id,
      achievementID: 1,
      claimStatus: "False",
    });

    //Create a free character for the user
    const freeCharacter = await UserBoughtCharacters.create({
      userID: user.id,
      charID: 1,
      purchaseDate: new Date(),
      status: "1",
      charVal: 0,
    });

    //create userprofile
    const profile = await UserProfile.create({
      profileID: user.id,
      avatar: "../../../public/assets/avatar/player.jpg",
      userLevel: 1,
      coins: 0,
      score: 0,
      cumulativeScore: 0,
    });
    // Create verification token
    const verificationToken = await Token.create({
      userId: user.id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    const baseURL = process.env.BASE_URL;
    // Generate verification URL (pointing to frontend)
    const verificationUrl = `${baseURL}5173/verify/${user.id}/${verificationToken.token}`;

    // Send email with verification link
    await sendEmail(
      user.email,
      "Verify Email",
      `Hello ${user.firstname}, Please verify your email by clicking on the link below: \n\n ${verificationUrl}`
    );

    res.status(201).send({
      message:
        "Verification email sent! Please check your inbox to verify your account.",
      success: true,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors.map((e) => e.message),
        success: false,
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Email or username already exists",
        details: error.errors.map((e) => e.message),
        success: false,
      });
    }
    res.status(500).json({
      message: "Error creating user",
      details: error.message,
      success: false,
    });
  }
};

const Verify = async (req, res) => {
  try {
    console.log("Verification attempt for user:", req.params.id);

    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log("User not found for verification");
      return res.status(404).json({
        message: "Invalid verification link",
        success: false,
      });
    }

    // Check if user is already verified
    if (user.verified) {
      console.log("User already verified:", user.email);
      return res.status(200).json({
        message: "Email already verified",
        success: true,
      });
    }

    const token = await Token.findOne({
      where: {
        userId: user.id,
        token: req.params.token,
      },
    });

    if (!token) {
      console.log("Token not found for verification");
      return res.status(400).json({
        message: "Invalid or expired verification link",
        success: false,
      });
    }

    // Update user verification status
    await User.update(
      { verified: true },
      {
        where: { id: user.id },
      }
    );

    // Delete the verification token
    await token.destroy();

    console.log("User verified successfully:", user.email);

    // Send success response
    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in verification:", error);
    return res.status(500).json({
      message: "Error verifying email",
      details: error.message,
      success: false,
    });
  }
};

const Home = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user data",
      details: error.message,
      success: false,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findByPk(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "User profile not found",
        success: false,
      });
    }

    res.status(200).json({
      profile,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Error fetching user profile",
      details: error.message,
      success: false,
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const avatar = `../../../${req.body.avatar}`;

    if (!avatar) {
      return res.status(400).json({
        message: "Avatar path is required",
        success: false,
      });
    }

    // Update the user's avatar in the database
    await UserProfile.update({ avatar }, { where: { profileID: userId } });

    res.status(200).json({
      message: "Avatar updated successfully",
      avatarUrl: avatar,
      success: true,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({
      message: "Error updating avatar",
      details: error.message,
      success: false,
      error,
    });
  }
};

module.exports = { Signup, Login, Verify, Home, getUserProfile, updateAvatar };
