const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SERVICE_EMAIL_ADDRESS,
        pass: process.env.SERVICE_EMAIL_PASSWORD,
    },
})

function resetPasswordEmailOptions(_to, _token) {
    return {
        from: `Music App <${process.env.SERVICE_EMAIL_ADDRESS}>`,
        to: _to,
        subject: `Đây là thư đổi mật khẩu tài khoản của bạn.`,
        text: `Đây là thư đổi mật khẩu tài khoản của bạn.`,
        html: `<p>Đây là mã xác nhận đổi mật khẩu của bạn <${_token}> . Mã xác nhận này sẽ có hiệu lực trong 10 phút. Xin cảm ơn ! </p>`,
    }
}

module.exports = {
    transporter,
    resetPasswordEmailOptions,
}
