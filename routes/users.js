const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const authToken = require('../middleware/authToken')

// Get all users
router.get('/', authToken, async (req, res) => {
    const users = await User.find()
    res.send(users)
})

// Endpoint at /users/login
router.post('/login', async (req, res) => {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email }).exec()
    if (user == null) {
        return res.status(401).send({ msg: "User not found" })
    }

    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
        return res.status(401).send({ msg: "Wrong password" })
    }

    const token = jwt.sign({
        sub: user._id, // sub = Subject, user-id
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.send({ msg: 'Login succesful', token: token })

    /* Good way to generate random string in the node console: 
    require('crypto').randomBytes(32).toString('hex') */

})

// Create new user
router.post('/', async (req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword
        })

        const newUser = await user.save()

        res.send(newUser)

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

module.exports = router