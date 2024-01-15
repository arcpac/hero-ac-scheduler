const mongoose = require("mongoose");
const crypto = require("crypto");

const embeddedUserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  name: String,
});

const usersSchema = new mongoose.Schema(
  {
    image: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    loggedIn: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    changedAt: {
      type: Date,
    },
    embeddedUser: {
      type: embeddedUserSchema,
      default: {},
    },
    tokens: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

usersSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);
  return resetToken;
};

module.exports = mongoose.model("User", usersSchema);
