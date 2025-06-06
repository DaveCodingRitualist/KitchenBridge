const express = require ('express')
const {
    addWaiter,
    deleteWaiter,
    getWaiters
} = require('../controllers/waiterController')
const router = express.Router()

const requireAuth = require('../middleware/requireAuth')


 
 router.use(requireAuth)
 
// getWaiters
router.get('/', getWaiters)

// add waiter 
router.post('/', addWaiter)

// deleteWaiter
router.delete('/:id', deleteWaiter)


module.exports = router