const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurants')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/', authenticator, home)
router.use('/restaurants', authenticator, restaurant)

module.exports = router
