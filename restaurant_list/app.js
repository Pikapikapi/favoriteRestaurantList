//require當中，如果沒有給定路徑，直接寫檔案名稱
//會自動先去node_modules的路徑下搜尋
//如果有給定路徑，則是在指定目錄下搜尋(e.g. 使用./則是在該檔案app.js的同一層路徑下尋找名為movieList.json的檔案)
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const port = 3000

//using dotenv while run dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoDB error!')
})

db.once('open', () => {
  console.log('mongoDB connect')
})

// express template engine
// handlebars 使用的模板與使用HTML相似，就不用像下面寫一整串難維護難看的排版了
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

// express no need to decide conten type
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant: restaurant })
})

// querystring => 使用query取得網址?後面的參數
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    )
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
