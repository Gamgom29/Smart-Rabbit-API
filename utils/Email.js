const nodemailer = require('nodemailer');
const pug = require("pug");
const HtmlToText = require("html-to-text");
module.exports =  class Email {
    constructor(user ,otp ){
        this.to = user.email;
        this.name = user.name;
        this.from = `Smart Rabbit <${process.env.EMAIL_FROM}>`;
        this.otp = otp;
    }
    createTransport(){
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    async send(tmeplate , subject  ){
        const html = pug.renderFile(`${__dirname}/../views/${tmeplate}.pug`, {
            name: this.name,
            subject,
            otp:this.otp
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: HtmlToText.htmlToText(html),
        };
        return await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to SmartRabbit!');
    }
    async sendResetPassword() {
        await this.send('resetcode', 'Reset Password');
    }
} 