const User = require("./users.mongo")
const UserTypes = require("./userTypes.mongo")
const bcrypt = require("bcryptjs")

async function getAllUsers(user) {
  return await usersFind(user.userType)
}

async function usersFind(userType) {
  switch (userType) {
    case "administrator":
      return await User.find({ $or: [{ userType: "moderator" }, { userType: "viewer" }] })
    case "super_admin":
      return await User.find({})
    default:
      return [{}]
  }
}

async function getUsersCount() {
  const active = (await User.find({ active: true })).length
  const inactive = (await User.find({ active: false })).length
  return { activeCount: active, inactiveCount: inactive }
}

async function getUser(id) {
  try {
    const user = await User.findById(id)
    if (!user) {
      return { responseCode: 404, message: "No user found" }
    }
    return { responseCode: 200, message: user }
  } catch (err) {
    return { responseCode: 400, message: err }
  }

}

async function saveUser(user) {
  const userType = await UserTypes.findOne({
    name: user.userType,
  })
  if (!userType) {
    return { responseCode: 404, message: "No matching user type found" }
  }

  const newUser = new User(user)
  try {
    const savedUser = await newUser.save()
    if (savedUser) {
      return { responseCode: 201, message: savedUser }
    }
  } catch (err) {
    return { responseCode: 404, message: err }
  }
}

async function addNewUser(creator, userParams) {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(userParams.password.replace(/\s+/g, ''), 12)
  } catch (err) {
    return { responseCode: 400, message: "Technical server-side error" }
  }
  const newUser = Object.assign(userParams,
    {
      password: hashedPassword,
      active: true,
      deleted: false,
      embeddedUser: {
        name: `${creator.firstName} ${creator.lastName}`,
        email: `${creator.email}`
      }
    })
  const result = await saveUser(newUser)
  return result
}

async function deleteUser(userId) {
  try {
    const deletedUser = await User.findOneAndUpdate(
      { _id: userId, userType: { $ne: "super_admin" } },
      {
        deleted: true,
        active: false
      })
    if (!deletedUser) {
      return { responseCode: 404, message: "Unable to delete user" }
    }
    return { responseCode: 201, message: "User successfully deleted." }
  } catch (err) {
    return { responseCode: 404, message: err }
  }
}

async function deactivateUser(userId, action) {
  const status = action ? "activate" : "deactivate"
  try {
    const deletedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        deleted: action === "activate" ? true : false,
        active: action
      })
    if (!deletedUser) {
      return { responseCode: 404, message: `Unable to ${status} user` }
    }
    return { responseCode: 201, message: `User successfully ${status}.` }
  } catch (err) {
    return { responseCode: 404, message: err }
  }
}

async function updateUser(userId, userParams) {
  const updatedUser = await User.findByIdAndUpdate(userId, userParams, { new: true })
  try {
    if (!updatedUser) {
      return { responseCode: 404, message: "Error updating user." }
    }
    return { responseCode: 201, message: updatedUser }
  } catch (err) {
    return { responseCode: 404, message: err }
  }
}

async function saveNewPassword(user, params) {
  const query = { "email": `${user.email}`, "active": true, "deleted": false }
  const options = {
    returnDocument: 'after',
  };
  const updatedUser = await User.findOneAndUpdate(query, params)

  if (!updatedUser) {
    return { responseCode: 404, message: "User doesn't exist" }
  }
  return { responseCode: 200, message: updatedUser }
}

async function validateCurrentPassword(user, currentPassword) {
  const existingUser = await User.findById(user.userId)
  const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password)
  return isValidPassword
}

async function checkExistsUser(userId) {
  return await User.findOne({ _id: userId })
}

module.exports = {
  addNewUser,
  getUsersCount,
  getAllUsers,
  deleteUser,
  checkExistsUser,
  deactivateUser,
  saveUser,
  updateUser,
  getUser,
  saveNewPassword,
  validateCurrentPassword
};
