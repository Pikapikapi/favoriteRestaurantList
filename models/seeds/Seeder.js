if (process.env.NODE_ENV !== 'production') {
  // require('dotenv').config()
  require('dotenv').config({ path: __dirname + '/../../.env' })
}

const Restaurant = require('../restaurants')
const User = require('../user')
const restaurantsList = require('../../restaurant.json').results
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

db.on('error', () => {
  console.log('mongodb error!')
})

const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
  },
]

db.once('open', () => {
  console.log('mongodb connected!')

  for (const seedUser of SEED_USERS) {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(seedUser.password, salt))
      .then((hash) =>
        User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash,
        })
      )
      .then((user) => {
        const userId = user._id
        const restaurant = []

        let start = 0
        let end = 3
        if (!seedUser.name.includes('1')) {
          start = start + 3
          end = end + 3
        }
        for (let i = start; i < end; i++) {
          restaurantsList[i].userId = userId
          restaurant.push(restaurantsList[i])
        }
        console.log(restaurant)
        return Restaurant.create(restaurant)
      })
      .then(() => {
        console.log('seedUser done.')
        //只有使用seed建立會使用到，所以seeder做好以後要把這個臨時的node.js程序結束
        //實際效果就是node.js的server運行會關閉，如果沒有exit()，將會是正常的運行server
        process.exit()
      })
      .catch((err) => console.log(err))
  }
  console.log('使用者與餐廳資料創建完成.')
})
