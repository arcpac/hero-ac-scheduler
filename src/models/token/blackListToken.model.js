const BlackListToken = require("./blackListToken.mongo")

async function revokeToken(params) {
    try {
        const decoded = jwt.verify(params.token, "supersecret_dont_share");
        return decoded
    } catch (err) {
        return { responseCode: 401, message: "Invalid request." }
    }
    const newRevokedToken = new BlackListToken(params.token)
    console.log(newRevokedToken)
    // try {
    //     const parsedToken = Object.assign(newRevokedToken, {
    //         reason: "expired. logout",
    //     })
    //     const savedToken = await parsedToken.save()
    //     if (!savedToken) {
    //         return { responseCode: 201, message: savedToken }
    //     }
    // } catch (err) {
    //     return { responseCode: 404, message: err }
    // }
}

module.exports = {
    revokeToken
}