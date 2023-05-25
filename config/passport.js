const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email })
          .then((user) => {
            if (user) return done(null, user)
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt
              .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
              .then((salt) => bcrypt.hash(randomPassword, salt)) // 為使用者密碼「加鹽」，產生雜湊值
              .then((hash) =>
                User.create({
                  name,
                  email,
                  password: hash,
                })
              )
              .then((user) => done(null, user))
              .catch((error) => done(error, false))
          })
          .catch((error) => done(error, false))
      }
    )
  )
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            req.flash('warning_msg', 'That email is not registered!')
            return done(null, false)
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              req.flash('warning_msg', 'Email or Password incorrect.')
              return done(null, false)
            }
            return done(null, user)
          })
        })
        .catch((err) => done(err, false))
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  })
}