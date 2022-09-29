const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Booking = require('../models/booking')
const Cabin = require('../models/cabin')
const authToken = require('../middleware/authToken')

// Get all users
router.get('/', authToken, async (req, res) => {
    const bookings = await Booking.find()
    res.send(bookings)
})

// Create new user
router.post('/', authToken, async (req, res) => {
    try {

        try {
            const cabinFound = await Cabin.findOne({ _id: req.body.cabin })
        } catch (error) {
            return res.send({ msg: "No such cabin in database" })
        }

        const book = await Booking.findOne({
            cabin: req.body.cabin,
            startdate: { $lt: req.body.enddate },
            enddate: { $gt: req.body.startdate }
        }).exec()
        if (book) {
            return res.send({ msg: "Selected time for booking not available" })
        }

        const booking = new Booking({
            author: req.author.sub,
            cabin: req.body.cabin,
            startdate: req.body.startdate,
            enddate: req.body.enddate

        })

        const newBooking = await booking.save()

        res.send({ saved: newBooking })

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Change/modify booking info
router.patch('/:id', authToken, async (req, res) => {
    try {
        // TODO: Fix req.cabin.sub 
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: req.params.id, author: req.author.sub },
            req.body,
            { new: true }
        )
        res.send({ msg: "Booking info updated", updatedBooking: updatedBooking })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Delete booking
router.delete('/:id', authToken, async (req, res) => {
    try {
        const booking = await Booking.deleteOne({
            _id: req.params.id
            // TODO: Fix req.landlord.sub 
            // author: req.author.sub
        })

        if (!booking) {
            return res.status(404).send({ msg: "Booking not found" })
        }
        res.send(booking)
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

module.exports = router