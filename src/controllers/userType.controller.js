const { saveUserType, addNewUserType, getAllUserTypes, deleteUserType } = require("../models/users/userTypes.model")

async function httpGetUserTypes(req, res) {
    const userTypes = await getAllUserTypes();
    return res.status(200).json(userTypes)
}

async function httpAddNewUserType(req, res) {
    const userTypeParams = req.body
    const result = await addNewUserType(userTypeParams)
    res.status(result.responseCode).json(result.message);
}

async function httpDeleteUserType(req, res) {
    const id = req.params.id
    const result = await deleteUserType(id)
    res.status(result.responseCode).json(result)
}
module.exports = {
    httpAddNewUserType,
    httpGetUserTypes,
    httpDeleteUserType
}