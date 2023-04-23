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
            message: 'Missing username and/or password',
        })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'User not found' })
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid password' })
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            config.accessTokenSecret
        )

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            accessToken: accessToken,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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
                .json({ success: false, message: 'Email already taken' })
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
            { userId: newUser._id, role: newUser.role },
            process.env.ACCESS_TOKEN_SECRET
        )

        return res.status(201).json({
            success: true,
            message: 'Register Successfully',
            accessToken,
            user: newUser,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

exports.forgetPassword = async (req, res) => {
    const { email = '' } = req.body

    try {
        const user = await User.findOne({ email: email }).select('email').lean()

        if (!user) {
            res.status(400).json({ success: false, message: 'Email not exist' })
        }

        const token = randomBytes(6).toString('hex')
        const emailOtp = await new OtpEmail({
            user_id: user._id,
            otp: token,
            email: user.email,
        }).save()

        await transporter.sendMail(
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
    const { opt = '' } = req.body

    try {
        const isExistOtp = await OtpEmail.find({
            opt: opt,
            time: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
        })

        if (!isExistOtp) {
            res.status(400).json({ success: false, message: 'opt invalid' })
        }

        res.status(200).json({ success: true })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}

exports.resetPassword = async (req, res) => {
    const { password = '', user_id = '' } = req.body

    try {
        const user = await User.findOneAndUpdate(
            { _id: user_id },
            { password: password }
        )
        if (!user) {
            res.json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, message: 'update success' })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}

exports.changePassword = async (req, res) => {
    const { user_id = '', password = '', newPassword = '' } = req.body

    try {
        const user = await User.findOneAndUpdate(
            { _id: user_id, password: password },
            { password: newPassword }
        )

        if (!user) {
            res.json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, message: 'update success' })
    } catch (error) {
        return res.json(500).json({ success: false, error })
    }
}
