const mongoose = require('mongoose')
const cabin = require('./cabin')

const bookingSchema = new mongoose.Schema({
    cabin: {
        type: String,
        require: true
    },
    startdate: {
        type: String,
        require: true
    },
    enddate: {
        type: String,
        require: true
    }

}, {timestamps: true})

module.exports = mongoose.model(
    'Booking', bookingSchema
)