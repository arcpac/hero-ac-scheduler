const nodemailer = require("nodemailer")
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { activityLog } = require("./activityLog");


const sendEmail = async (option) => {
    const confirmTemplate = path.join(__dirname, '..', 'docs', 'confirmEmailTemplate.html');
    const htmlContent = fs.readFileSync(confirmTemplate, 'utf8');
    const name = `${option.user.firstName} ${option.user.lastName}`;
    const email = `${option.user.email}`;
    const resetToken = option.resetToken

    const template = handlebars.compile(htmlContent);
    const replacements = {
        name,
        resetToken,
        email
    };

    const compiledHtml = template(replacements);
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const emailOptions = {
            from: "Airconnect support <airconnect@ac.com>",
            to: option.user.email,
            subject: option.subject,
            text: option.message,
            html: compiledHtml
        };

        const sendMail = await transporter.sendMail(emailOptions)
        if (sendMail.accepted.length) {
            await activityLog(option.user, "update", "request password", email, "-");
            return { responseCode: 200, message: { email: option.user.email } }
        }
        return { responseCode: 401, message: "Email service is unavailable." }
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {
    sendEmail,
};