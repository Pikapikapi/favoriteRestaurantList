const mongoose = require('mongoose')
const Restaurant = require('../restaurants')
const restaurantsList = require('../../restaurant.json').results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < restaurantsList.length; i++) {
    Restaurant.create({ ...restaurantsList[i] })
  }
  console.log('done')
})
