const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    waiterName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Prep'
    },
    createdAt: {
    type: Date,
    default: Date.now  // Default value for createdAt is the current date
  }
})

module.exports = mongoose.model('Oder', orderSchema)