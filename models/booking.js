const mongoose = require('mongoose')
const cabin = require('./cabin')

const bookingSchema = new mongoose.Schema({
    creator: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    startdate: {
        type: Date,
        require: true
    },
    enddate: {
        type: Date,
        require: true
    }

}, {timestamps: true})

module.exports = mongoose.model(
    'Booking', bookingSchema
)