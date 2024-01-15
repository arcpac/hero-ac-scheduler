const User = require("../users/users.mongo")

async function getAccount(id) {
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



module.exports = {
  getAccount,
  updateUser
};
