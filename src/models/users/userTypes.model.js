const UserTypes = require("./userTypes.mongo")

async function getAllUserTypes() {
    return await UserTypes.find({})
}

async function addNewUserType(params) {
    const check = await UserTypes.findOne({ name: params.name })

    if (check) {
        return { responseCode: 404, message: "User type already exists" }
    }
    const newUserType = new UserTypes(params)
    try {
        const savedUserType = await newUserType.save()
        if (savedUserType) {
            return { responseCode: 201, message: savedUserType }
        }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}

async function deleteUserType(userTypeId) {
    try {
        const deletedUserType = await UserTypes.findByIdAndDelete(userTypeId, { new: true })
        if (!deletedUserType) {
            return { responseCode: 404, message: "Error deleting user type." }
        }
        return { responseCode: 200, message: `${deletedUserType.name} has been deleted.` }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}

module.exports = {
    getAllUserTypes,
    addNewUserType,
    deleteUserType
}