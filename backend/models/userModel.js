const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  loginCode: {
    type: String,
    required: true
  }
});

// static signup method
userSchema.statics.signup = async function (email, password) {
    // validator
    if(!email || !password) {
        throw Error('All field must be filled')
    }
    if(!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)) {
        throw Error('Passord not strong enough')
    }
    const exists = await this.findOne({ email })
    
    if (exists) {
        throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ email, password: hash })
    return user
}
// static login method
userSchema.statics.signup = async function (companyName, loginCode) {
  if (!companyName || !loginCode) {
    throw Error('All fields must be filled');
  }

  const exists = await this.findOne({ companyName });
  if (exists) {
    throw Error('Company already registered');
  }

  const user = await this.create({ companyName, loginCode });
  return user;
};

userSchema.statics.login = async function (companyName, loginCode) {
  if (!companyName || !loginCode) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ companyName });
  if (!user || user.loginCode !== loginCode) {
    throw Error('Invalid login');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema)