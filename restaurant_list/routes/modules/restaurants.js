const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurants')

//進入新增頁面
router.get('/new', (req, res) => {
  return res.render('new')
})
//新增餐廳
router.post('/new/restaurant', (req, res) => {
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
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch((error) => console.log(error))
})

//使用者進入修改畫面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.log(error))
})

//使用者可以修改一家餐廳的資訊
router.post('/:id/edit', (req, res) => {
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
router.post('/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

// querystring => 使用query取得網址?後面的參數
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const searchKeywordRegExp = new RegExp(keyword, 'i')
  Restaurant.find({
    $or: [
      {
        name: {
          $regex: searchKeywordRegExp,
        },
      },
      {
        category: {
          $regex: searchKeywordRegExp,
        },
      },
    ],
  })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', {
        restaurants,
        keyword,
      })
    })
})

module.exports = router
