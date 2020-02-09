const nodemailer = require("nodemailer");
module.exports = async function (options) {
    // 1.  create  setting
    try {
        var transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "pepcodingdev@gmail.com",
                pass: "apppassword"
            }
        });
        // 2. Email options
        const emailOptions = {
            from: '"Origami" <admin@origami.com>', // sender address
            to: options.to, // list of receivers
            subject: options.subject, // Subject line
            text: options.text,
            html: option.html // html body
        };
        // "<h1>Reset Token:</h1><p>token</p>"
        // 3. Send your mail
        await transport.sendMail(emailOptions);
    } catch (err) {
        throw new Error(err);
    }
};