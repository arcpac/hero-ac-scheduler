const express = require("express");
const User = require("../../models/users/users.mongo");
const { sendEmail } = require("../../utils/email");
const crypto = require("crypto")
const bcrypt = require("bcryptjs");
const { activityLog } = require("../../utils/activityLog");


const authRouter = express.Router()
authRouter.post("/", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({ message: "Please contact the site administrator." });
    }
    const resetToken = user.createResetPasswordToken()
    user.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
    const message = `Password reset request has been received. Please click the link below to proceed \n\n ${resetUrl} \n\n valid for only 10 minutes`
    try {
        const result = await sendEmail({
            user: user,
            subject: "Airconnect Password Reset",
            message: message,
            resetToken: resetToken,
            resetUrl: resetUrl
        })

        return res.status(200).json(result);

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined
        user.save()
        return res.status(500).json({ message: "There was an error sending password reset email." });
    }
})

authRouter.patch("/:token", async (req, res) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const { password, confirm_password } = req.body

    if (password === confirm_password) {
        const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: Date.now() } })

        if (!user) {
            return res.status(404).json({ message: "Reset password is not valid." });
        }

        user.password = hashedPassword = await bcrypt.hash(password, 12)
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.changedAt = Date.now()
        user.save()
        const result = await activityLog(user, "update", "changed password", user, req.ip);
        console.log(result)
        return res.status(200).json({ responseCode: 200, message: "Reset password successful. Please login again." });
    }
    return res.status(404).json({ responseCode: 404, message: "Passwords do not match." });

})

module.exports = authRouter