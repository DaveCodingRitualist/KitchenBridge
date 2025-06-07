const express = require('express')

const { createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    updateChat,
    adminResponse,
    toggleAttention
 } = require('../controllers/oderController')

 const requireAuth = require('../middleware/requireAuth')

 const router = express.Router()

 router.use(requireAuth)

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

// UPDATE a Order
router.patch('/chat/:id', updateChat)

router.patch('/admin/chat/:id', adminResponse)

// PUT /api/orders/attention/:id
router.put("/attention/:id", toggleAttention)

module.exports = router
