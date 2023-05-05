const jwt = require('jsonwebtoken')
const User = require('../model/User')
const OtpEmail = require('../model/OtpEmail')
const { config } = require('../config/index')
const bcrypt = require('bcrypt')
const { randomBytes } = require('node:crypto')
const { resetPasswordEmailOptions, transporter } = require('../service/email')

exports.loginUser = async (req, res) => {
    const { email = '', password = '' } = req.body

    if (!email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Email hoặc Password không được để trống',
        })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'Không tìm thấy User' })
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
            return res
                .status(400)
                .json({ success: false, message: 'Mật khẩu không hợp lệ' })
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            config.accessTokenSecret
        )

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            user,
            accessToken: accessToken,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
        })
    }
}

exports.registerUser = async (req, res) => {
    const { username = 'User', email = '', password = '' } = req.body
    console.log('body: ', req.body)

    try {
        const user = await User.findOne({ email })

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: 'Email đã tồn tại' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        await newUser.save()

        // Return token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        )

        return res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            accessToken,
            user: newUser,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
        })
    }
}

exports.forgetPassword = async (req, res) => {
    const { email = '' } = req.body

    try {
        const user = await User.findOne({ email: email }).select('email').lean()

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'Email không tồn tại' })
        }

        const token = randomBytes(6).toString('hex')
        const emailOtp = await new OtpEmail({
            user_id: user._id,
            otp: token,
            email: user.email,
        }).save()

        transporter.sendMail(
            resetPasswordEmailOptions(emailOtp.email, emailOtp.otp),
            function (error, info) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('Email sent: ' + info.response)
                }
            }
        )

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}

exports.checkOtpEmail = async (req, res) => {
    const { otp = '', email = '' } = req.body

    try {
        const isExistOtp = await OtpEmail.findOne({
            otp: otp,
            email: email,
            time: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
        })

        if (!isExistOtp) {
            return res
                .status(400)
                .json({ success: false, message: 'Otp không hợp lệ' })
        }

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}

exports.resetPassword = async (req, res) => {
    const { password = '', user_id = '' } = req.body

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.findOne({ _id: user_id })
            .select('password')
            .lean()

        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy User' })
        }

        const isDuplicate = await bcrypt.compare(password, user.password)

        if (isDuplicate) {
            return res.json({
                success: false,
                message: 'Mật khẩu mới giống với mật khẩu cũ',
            })
        }

        await User.updateOne({ _id: user_id }, { password: hashedPassword })

        return res.json({
            success: true,
            message: 'Cài lại mật khẩu thành công ',
        })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}

exports.changePassword = async (req, res) => {
    const { user_id = '', password = '', newPassword = '' } = req.body

    try {
        if (newPassword == password) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới giống với mật khẩu cũ',
            })
        }

        const user = await User.findOne({ _id: user_id })
            .select('_id password')
            .lean()

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'Không tìm thấy User' })
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu không hợp lệ',
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const newUser = await User.updateOne(
            { _id: user_id },
            { password: hashedPassword }
        ).lean()

        if (!user) {
            return res.json({
                success: false,
                message: 'Không tìm thấy User',
                data: newUser.password,
            })
        }
        return res.json({
            success: true,
            message: 'Thay đổi mật khẩu thành công',
        })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}
