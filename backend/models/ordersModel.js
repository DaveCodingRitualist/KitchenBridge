const mongoose = require('mongoose')
const { type } = require('os')

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
    chat: {
        type: Array,
        default: []
    },
     user_id: {
        type: String,
        required: true
    },
      attention: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Array of order IDs
    createdAt: {
    type: Date,
    default: Date.now  // Default value for createdAt is the current date
  }
})

module.exports = mongoose.model('Oder', orderSchema)