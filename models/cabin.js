const mongoose = require('mongoose')

const cabinSchema = new mongoose.Schema({
    address: {
        type: String,
        require: true
    },
    size: {
        type: Number,
        require: true
    },
    sauna: {
        type: Boolean
    },
    beach: {
        type: Boolean
    },
    rent: {
        type: Number,
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model(
    'Cabin', cabinSchema
)