const express = require('express')
const router = express.Router()
const { checkInAttandance } = require('../controllers/attandance.controller')
const checkToken = require('../middlewares/checkToken')

router.post('/hik', checkToken, checkInAttandance)

module.exports = router
