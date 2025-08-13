const express = require('express')
const router = express.Router()
const { checkInAttandance } = require('../controllers/attandance.controller')

router.post('/', checkInAttandance)

module.exports = router
