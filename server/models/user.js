const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  verified: {
    type: Boolean,
    required: false,
  },
});

userSchema.methods.generateJWT = () => {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    middlename: Joi.string().allow("").label("Middle Name"),
    username: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    birthdate: Joi.date().required().label("Birthdate"),
    gender: Joi.string().required().label("Gender"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
