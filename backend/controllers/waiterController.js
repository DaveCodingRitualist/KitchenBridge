const { default: mongoose } = require('mongoose')

const Waiter = require('../models/watersModel')

// get all waiters

const getWaiters = async (req, res) => {
    const user_id = req.user._id
    const waiters = await Waiter.find({user_id}).sort({createdAt: -1})

   res.status(200).json(waiters)
}

// add a waiter

const addWaiter = async (req, res) => {
    const user_id = req.user._id
    const { waiter } = req.body
    
    try {
        const newWaiter = await Waiter.create({waiter, user_id})
        res.status(200).json(newWaiter)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a waiter
const deleteWaiter = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({erro: 'No such Waiter'})
    }
    const waiter = await Waiter.findOneAndDelete({_id: id})

    if(!waiter) {
        return res.staus(404).json({error: 'No such waiter'})
    }
    res.status(200).json(waiter)
}

module.exports = {
    addWaiter,
    deleteWaiter,
    getWaiters
}