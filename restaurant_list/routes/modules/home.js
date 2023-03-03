const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurants')

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

module.exports = router
