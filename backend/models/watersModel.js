const mongoose = require('mongoose')

const Schema = mongoose.Schema

const waiterSchema = new Schema ({
    waiter: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // Default value for createdAt is the current date
      }
})

module.exports = mongoose.model('waiter', waiterSchema)
