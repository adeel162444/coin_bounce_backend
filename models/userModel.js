const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },

    email: {
      type: String,
    },
  },
  { timestamps: true }
);
//password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

const userModel = mongoose.model("User", userSchema, "users");
module.exports = userModel;
