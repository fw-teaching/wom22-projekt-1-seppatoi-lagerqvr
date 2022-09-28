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
router.post('/', authToken, async (req, res) => {
    try {

        const cabin = new Cabin({
            landlord: req.author.sub,
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

// Change/modify cabin info
router.patch('/:id', authToken, async (req, res) => {
    try {
        // TODO: Fix req.landlord.sub 
        const updatedCabin = await Cabin.findOneAndUpdate(
            { _id: req.params.id,  author: req.author.sub  },
            req.body,
            { new: true }
        )
        res.send({ msg: "Cabin info updated", updatedCabin: updatedCabin })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Delete cabins
router.delete('/:id', authToken, async (req, res) => {
    try {
        const cabin = await Cabin.deleteOne({
            _id: req.params.id
            // TODO: Fix req.landlord.sub 
            // author: req.author.sub
        })

        if (!cabin) {
            return res.status(404).send({ msg: "Cabin not found" })
        }
        res.send(cabin)
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

module.exports = router