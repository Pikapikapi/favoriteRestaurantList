//require當中，如果沒有給定路徑，直接寫檔案名稱
//會自動先去node_modules的路徑下搜尋
//如果有給定路徑，則是在指定目錄下搜尋(e.g. 使用./則是在該檔案app.js的同一層路徑下尋找名為movieList.json的檔案)
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurants')
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
//add body parser
app.use(bodyParser.urlencoded({ extended: true }))
// express no need to decide conten type
//首頁，使用者可以瀏覽所有餐廳
app.get('/', (req, res) => {
  Restaurant.find() //資料庫查找資料
    .lean() //把資料轉換成單純的JS物件
    .then((restaurants) => res.render('index', { restaurants })) //把資料送給前端樣板
    .catch((error) => console.log(error)) //錯誤處理
})

//進入新增頁面
app.get('/new', (req, res) => {
  return res.render('new')
})
//新增餐廳
app.post('/new/restaurant', (req, res) => {
  const restaurant = Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
  })

  restaurant.save((err) => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

//使用者瀏覽一家餐廳的詳細資訊
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch((error) => console.log(error))
})

//使用者進入修改畫面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.log(error))
})

//使用者可以修改一家餐廳的資訊
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const newRestaurant = Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
  })
  //1.查詢資料
  //2.如果查詢到資料，修改後重新儲存資料
  //3.儲存成功後，導向餐廳頁面
  return Restaurant.findById(id)
    .then((restaurant) => {
      Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error))
})
//使用者可以刪除一家餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
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
