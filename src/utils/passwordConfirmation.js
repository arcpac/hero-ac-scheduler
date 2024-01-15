const User = require("../models/users/users.mongo");
const bcrypt = require("bcryptjs");

async function passwordConfirmation(req) {
  const enteredPassword = req.body.password;
  const { user } = req;
  let existingUser;
  let isValidPassword;
  try {
    existingUser = await User.findOne({ email: user.email, deleted: false, active: true });
    console.log(existingUser, enteredPassword)
    if (!existingUser) {
      return { responseCode: 404, message: "Invalid password" };
    }
    isValidPassword = await bcrypt.compare(
      enteredPassword,
      existingUser.password
    );

    if (!isValidPassword) {
      return { responseCode: 404, message: "Invalid password" };
    } else {
      return { responseCode: 200, message: isValidPassword };
    }
  } catch (err) {
    return { responseCode: 404, message: "Invalid password" };
  }
}

module.exports = {
  passwordConfirmation,
};
