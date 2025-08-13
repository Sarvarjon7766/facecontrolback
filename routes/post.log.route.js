const express = require('express')
const router = express.Router()
const { getAll, create, getByPost } = require('../controllers/post.log.controller')
const verifyToken = require('../middlewares/verifyToken')

router.get('/getAll', verifyToken, getAll)
router.get('/getByPost/:id', verifyToken, getByPost)
router.post('/create', create)

module.exports = router
