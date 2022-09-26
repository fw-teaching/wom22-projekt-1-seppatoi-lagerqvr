const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Booking = require('../models/booking')
const authToken = require('../middleware/authToken')

// Get all users
router.get('/', authToken, async (req, res) => {
    const bookings = await Booking.find()
    res.send(bookings)
})

// Create new user
router.post('/', async (req, res) => {
    try {

        const booking = new Booking({
            cabin: req.body.cabin,
            startdate: req.body.startdate,
            enddate: req.body.enddate
        })

        const newBooking = await booking.save()

        res.send(newBooking)

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

module.exports = router