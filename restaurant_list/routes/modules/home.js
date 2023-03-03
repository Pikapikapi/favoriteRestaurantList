const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurants')
const bodyParser = require('body-parser')
//首頁，使用者可以瀏覽所有餐廳
router.get('/', (req, res) => {
  Restaurant.find() //資料庫查找資料
    .lean() //把資料轉換成單純的JS物件
    .sort({ _id: 'asc' })
    .then((restaurants) => {
      res.render('index', { restaurants })
    }) //把資料送給前端樣板
    .catch((error) => console.log(error)) //錯誤處理
})

// querystring => 使用query取得網址?後面的參數
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
        name_en: {
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
