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

const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: 'Aa12345678',
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: 'Bb12345678',
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
        return Promise.all(
          Array.from({ length: 10 }, (_, i) =>
            Todo.create({ name: `name-${i}`, userId })
          )
        )
      })
      .then(() => {
        console.log('seedUser: ' + seedUser.name + ' done.')
        //只有使用seed建立會使用到，所以seeder做好以後要把這個臨時的node.js程序結束
        //實際效果就是node.js的server運行會關閉，如果沒有exit()，將會是正常的運行server
        process.exit()
      })
  }
  console.log('使用者與餐廳資料創建完成.')
})
