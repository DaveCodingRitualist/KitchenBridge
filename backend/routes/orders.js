const express = require('express')

const { createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
 } = require('../controllers/oderController')

 const router = express.Router()
 
//GET all the orders
router.get('/', getOrders)

// GET a single order
router.get('/:id', getOrder)

// POST a new workout
router.post('/', createOrder)

// DELETE a workout
router.delete('/:id', deleteOrder)

// UPDATE a Order
router.patch('/:id', updateOrder)

module.exports = router
