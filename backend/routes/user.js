const express = require('express')
const { signupUser, loginUser, getUsers } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// get all users
router.get('/login', getUsers)

module.exports = router