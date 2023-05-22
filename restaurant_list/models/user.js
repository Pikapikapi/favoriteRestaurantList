const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
module.exports = mongoose.model('User', userSchema)
