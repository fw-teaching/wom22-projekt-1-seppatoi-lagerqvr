const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Cabin = require('../models/cabin')
const authToken = require('../middleware/authToken')

// Get all cabins
router.get('/', authToken, async (req, res) => {
    const cabins = await Cabin.find()
    res.send(cabins)
})


// Create new cabin
router.post('/', async (req, res) => {
    try {

        const cabin = new Cabin({
            address: req.body.address,
            size: req.body.size,
            sauna: req.body.sauna,
            beach: req.body.beach,
            rent: req.body.rent
        })

        const newCabin = await cabin.save()

        res.send(newCabin)

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

module.exports = router