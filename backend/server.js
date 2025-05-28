const express = require('express')
require('dotenv').config()
const cors = require('cors');
const mongoose = require ('mongoose')
const ordersRoutes = require('./routes/orders')
const waitersRoutes = require('./routes/waiters')


// express app
const app = express()


// middleware

//To check and attach data (the body) to a request
app.use(express.json())

// Enable CORS for all routes
app.use(cors());

// routes
app.use('/api/waiters', waitersRoutes)
app.use('/api/orders', ordersRoutes)


//connect to DB
mongoose.connect(process.env.MONGO_URI)
 .then((result) => app.listen (process.env.PORT, () => {
       console.log('connected to db & listening on port', process.env.PORT)
 }))
    .catch((err) => console.log(err))