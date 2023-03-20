const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: {
    type: String,
    // required: [true, "user must have a profile photo"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      // this only works for .create or .save!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords do not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
