const User = require("../../models/users/users.mongo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { activityLog } = require("../../utils/activityLog");

async function login(req, res) {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
      active: true,
      deleted: false,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Invalid login, please try again." });
  }

  if (!existingUser) {
    return res
      .status(401)
      .json({ message: "Invalid login, please try again." });
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid login, please try again." });
  }

  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: "Invalid login, please try again." });
  } else {
    try {
      let token;
      token = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
          userType: existingUser.userType,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
        },
        "supersecret_dont_share",
        { expiresIn: "1h" }
      );

      let oldTokens = existingUser.tokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter((t) => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 84600) {
            return t;
          }
        });
      }
      const storedUserToken = await User.findByIdAndUpdate(existingUser._id, {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
        loggedIn: Date.now(),
      });

      await activityLog(
        { email: email },
        "login",
        "login",
        { email: email },
        "123.123"
      );
      return res.status(200).json({
        message: "Logged in",
        userId: existingUser._id,
        user: existingUser,
        email: existingUser.email,
        token: token,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal error. Please contact support." });
    }
  }
}

module.exports = {
  login,
};
