const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

//login block
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.flash('warning_msg', 'Need to enter email and password')
    return res.redirect('/users/login')
  } else {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true,
    })(req, res, next)
  }
})

//login block end

//register block
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了姓名以外的欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then((user) => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      res.render('register', {
        name,
        email,
        password,
        confirmPassword,
      })
    }
    return bcrypt
      .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
      .then((salt) => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash, // 用雜湊值取代原本的使用者密碼
        })
      )
      .then(() => {
        req.flash('success_msg', '帳號註冊成功。')
        res.redirect('/')
      })
      .catch((err) => console.log(err))
  })
})
//register block end

//logout block
router.get('/logout', (req, res) => {
  //清除session
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/user/login')
})
//logout block end
module.exports = router
