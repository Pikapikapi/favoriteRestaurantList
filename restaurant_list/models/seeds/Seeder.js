const Restaurant = require('../restaurants')
const restaurantsList = require('../../restaurant.json').results
if (process.env.NODE_ENV !== 'production') {
  // require('dotenv').config()
  require('dotenv').config({ path: __dirname + '/../../.env' })
}
const db = require('../../config/mongoose')
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
