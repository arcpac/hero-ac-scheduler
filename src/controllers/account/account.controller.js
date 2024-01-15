const {
  getAccount,
  updateUser,
} = require("../../models/account/account.model");
const bcrypt = require("bcryptjs");
const {
  saveNewPassword,
  validateCurrentPassword,
  getUser,
} = require("../../models/users/user.model");

async function httpGetAccount(req, res) {
  const userId = req.params.id;
  try {
    const result = await getAccount(userId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal error." });
  }
}

async function httpAccountImage(req, res) {
  try {
    const userId = req.params.id;
    const params = req.body;
    console.log(params);
    // const result = await getAccount(userId)
    // if (!image) {
    //     return res.status(400).json({ msg: "No image selected" });
    // }
    // const result = await updateUser(userId, image)
    // res.status(result.responseCode).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function httpChangePassword(req, res, next) {
  const user = req.user;
  const params = req.body;

  if (
    !(
      "currentPassword" in params &&
      "password" in params &&
      "confirmPassword" in params
    )
  ) {
    return res
      .status(401)
      .json({ responseCode: 401, message: "Invalid request." });
  }
  const checkCurrentPassword = await validateCurrentPassword(
    user,
    params.currentPassword
  );
  if (checkCurrentPassword === false) {
    return res.status(401).json({
      alertError: 401,
      message:
        "Error: The current password entered is incorrect. Please review and re-enter your current password. Should the issue persist, initiate a password reset via the 'Forgot Password' page.",
    });
  }

  if (
    params.confirmPassword === params.password &&
    checkCurrentPassword === true
  ) {
    const hashedPassword = await bcrypt.hash(params.password, 12);
    const updatedUserParams = Object.assign(
      {},
      {
        password: hashedPassword,
        changedAt: Date.now()
      }
    );
    const result = await saveNewPassword(user, updatedUserParams);
    res.status(200).json(result);
  } else {
    res
      .status(401)
      .json({ responseCode: 401, message: "Passwords do not match" });
  }
}

async function logout(req, res) {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "Logout failed." });
    }
    const { message } = await getUser(req.user.userId);
    const tokens = message.tokens;
    const newTokens = tokens.filter((t) => t.token !== token);
    const { responseCode } = await updateUser(message._id, {
      tokens: newTokens,
    });
    if (responseCode === 201) {
      return res
        .status(201)
        .json({ responseCode: 200, message: "Successfully logged out" });
    } else {
      return res.status(404).json({ message: "Logged out failed" });
    }
  }
}

module.exports = {
  httpGetAccount,
  httpAccountImage,
  httpChangePassword,
  logout,
};
