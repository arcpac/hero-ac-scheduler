const { getAllUsers, deleteUser, addNewUser, checkExistsUser, updateUser, getUser, getUsersCount, deactivateUser } = require("../models/users/user.model");
const User = require("../models/users/users.mongo");
const { activityLog } = require("../utils/activityLog");
const { validationResult } = require('express-validator');

async function httpGetUsers(req, res) {
  const users = await getAllUsers(req.user)
  return res.status(200).json(users);
}

async function httpGetUser(req, res) {
  const userId = req.params.id
  try {
    const result = await getUser(userId)
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal error." })
  }
}

async function httpAddNewUser(req, res) {
  const userParams = req.body
  if (userParams.password.replace(/\s+/g, "") === "") {
    return res.status(401).json({ responseCode: 401, message: "Enter your password" });
  }
  let existingUser
  try {
    existingUser = await User.findOne({ email: userParams.email })
  } catch (err) {
    return res.status(500).json(result);
  }
  if (existingUser) {
    return res.status(404).json({ responseCode: 404, type: "exist", message: "This email address is already in use." })
  }
  const result = await addNewUser(req.user, userParams)
  if (result.responseCode === 201) {
    await activityLog(req.user, "create", "user", result.message, req.ip);
  }
  res.status(result.responseCode).json(result);
}

async function httpDeleteUser(req, res) {
  const userId = req.params.id;
  const user = await checkExistsUser(userId)
  if (req.user.userType === "administrator" && user.userType === "administrator") {
    return res.status(404).json({
      error: "Unable to delete user.",
    });
  }
  if (!user) {
    return res.status(404).json({
      error: "User is not found.",
    });
  }

  const result = await deleteUser(userId);
  if (result.responseCode === 201) {
    await activityLog(req.user, "delete", "user", result.message, req.ip);
  }
  return res.status(result.responseCode).json(result);
}

async function httpDeactivateUser(req, res) {
  const userId = req.params.id

  const user = await checkExistsUser(userId)
  const action = !user.active
  const status = action ? "activate" : "deactivate"
  if (!user) {
    return res.status(404).json({
      error: "User is not found.",
    });
  }
  const result = await deactivateUser(userId, action);
  if (result.responseCode === 201) {
    await activityLog(req.user, `${status}`, "user", result.message, req.ip);
  }
  return res.status(result.responseCode).json(result);

}

async function httpUpdateUser(req, res) {
  const userId = req.params.id
  const params = req.body
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(404).json({ responseCode: 404, errors: errors.array() });
  }
  const result = await updateUser(userId, params)
  if (result.responseCode === 201) {
    await activityLog(req.user, "update", "user", result.message, req.ip);
  }
  res.status(result.responseCode).json(result)
}

async function httpGetUsersCount(req, res) {
  const count = await getUsersCount()
  return res.status(200).json(count);
}

module.exports = {
  httpGetUser,
  httpGetUsers,
  httpAddNewUser,
  httpDeleteUser,
  httpUpdateUser,
  httpGetUsersCount,
  httpDeactivateUser
};
