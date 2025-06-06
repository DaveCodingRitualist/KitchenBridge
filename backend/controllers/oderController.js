const { default: mongoose } = require('mongoose');
const Order = require('../models/ordersModel');

// Create an order
const createOrder = async (req, res) => {
    const user_id = req.user._id

    const { tableNumber, waiterName } = req.body;
    const io = req.app.get('io');

    try {
        const order = await Order.create({ tableNumber, waiterName, user_id });
        io.emit('orderCreated', order);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    const user_id = req.user._id; // Make sure user is authenticated
    try {
        const orders = await Order.find({ user_id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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

    // Emit the new Message
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


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

    // Emit the new Message
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

 
// Emit the new Message
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

//   // Emit a message after connection — testing only
//   socket.emit('newMessage', {
//     sender: 'Kitchen',
//     content: 'Order ready!',
//   });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
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

