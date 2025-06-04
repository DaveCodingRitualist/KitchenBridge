const { default: mongoose } = require('mongoose');
const Order = require('../models/ordersModel');

// Create an order
const createOrder = async (req, res) => {
    const { tableNumber, waiterName } = req.body;
    const io = req.app.get('io');

    try {
        const order = await Order.create({ tableNumber, waiterName });
        io.emit('orderCreated', order);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
};

// Get a single order
const getOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such order' });
    }

    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({ error: 'No such order' });
    }

    res.status(200).json(order);
};

// Update order status to "Ready"
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const io = req.app.get('io');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such order' });
    }

    const order = await Order.findByIdAndUpdate({ _id: id }, {
        status: "Ready"
    }, { new: true });

    if (!order) {
        return res.status(404).json({ error: 'No such order' });
    }

    io.emit('orderUpdated', order);
    res.status(200).json(order);
};

// Update chat with waiter question
const updateChat = async (req, res) => {
    const { id } = req.params;
    const io = req.app.get('io');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such order' });
    }

    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({ error: 'No such order' });
    }

    order.chat.push("How far is my order?");
    await order.save();

    io.emit('chatUpdated', order);
    res.status(200).json(order);
};

// Update admin response to chat
const adminResponse = async (req, res) => {
    const { id } = req.params;
    const { minutes } = req.body;
    const io = req.app.get('io');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such order' });
    }

    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({ error: 'No such order' });
    }

    const min = `${minutes} Minutes`;
    order.chat.push(min);
    await order.save();

    io.emit('chatUpdated', order);
    res.status(200).json(order);
};

// Delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    const io = req.app.get('io');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such order' });
    }

    const order = await Order.findByIdAndDelete({ _id: id });

    if (!order) {
        return res.status(404).json({ error: 'No such order' });
    }

    io.emit('orderDeleted', order._id); // emit only ID
    res.status(200).json(order);
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    updateChat,
    adminResponse
};

