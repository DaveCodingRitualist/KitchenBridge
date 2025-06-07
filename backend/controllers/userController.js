const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { companyName, loginCode } = req.body;

  try {
    const user = await User.login(companyName, loginCode);
    const token = createToken(user._id);
    res.status(200).json({ companyName, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { companyName, loginCode } = req.body;

  try {
    const user = await User.signup(companyName, loginCode);
    const token = createToken(user._id);
    res.status(200).json({ companyName, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('companyName') // only return company names
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

module.exports = { signupUser, loginUser, getUsers}