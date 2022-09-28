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

        const booking = new Booking({
            creator: req.author.sub,
            address: req.body.address,
            startdate: req.body.startdate,
            enddate: req.body.enddate
        })
        
        const cabinExists = await Cabin.findOne({address: req.body.address}).exec()

        if (cabinExists) {
            
            const newBooking = booking.save()

            res.send(newBooking)
        } else {
            res.send({ msg: "Cabin doesn't exist"})
        }

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Change/modify booking info
router.patch('/:id', authToken, async (req, res) => {
    try {
        // TODO: Fix req.cabin.sub 
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: req.params.id , author: req.author.sub  },
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