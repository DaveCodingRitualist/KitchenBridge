const { default: mongoose } = require('mongoose')
const Order = require('../models/ordersModel')

// Create an order
const createOrder = async (req, res) => {
    const {tableNumber, waiterName} = req.body

    try {
        const order = await Order.create({tableNumber, waiterName})
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// get all the orders
const getOrders = async (req, res) => {
    const orders = await Order.find().sort({createdAt: -1})

    res.status(200).json(orders)
}

// get a single order
const getOrder = async (req, res) => {
    const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'No such workout'})
        }

        const order = await Order.findById(id)
    

        if (!order) {
            return res.status(404).json({error: 'No such workout'})
        }
        res.status(200).json(order)

}

// update an order 
const updateOrder = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const order = await Order.findByIdAndUpdate({ _id: id }, {
        status: "Ready"
    })
    
    if (!order) {
        return res.status(404).json({error: 'No such order'})
    }
    res.status(200).json(order)
}

// delete an order 
const deleteOrder = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Order'})
    }

    const order = await Order.findByIdAndDelete({_id: id})

    if(!order) {
        return res.status(404).json({error: 'No such Order'})
    }
    res.status(200).json(order)
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
}