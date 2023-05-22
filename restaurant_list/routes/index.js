const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurants')
const user = require('./modules/users')

router.use('/users', user)
router.use('/', home)
router.use('/restaurants', restaurant)

module.exports = router
