const express = require('express')
const { register, auth, getAll, getById, getUser, update, getAllpost, updatepost, registerpost, getLavel } = require('../controllers/user.controller')
const { attendanceGetOne } = require('../controllers/attandance.controller')
const verifyToken = require('../middlewares/verifyToken')
const checkLoginToken = require('../middlewares/checklogintoken')
const upload = require('../middlewares/upload')
const deleteOldImage = require('../middlewares/deleteOldImage')
const router = express.Router()

router.post('/register', verifyToken, upload.single('image'), register)
router.post('/registerpost', verifyToken, upload.single('image'), registerpost)
router.put('/update/:id', verifyToken, upload.single('image'), deleteOldImage, update)
router.put('/updatepost/:id', verifyToken, upload.single('image'), deleteOldImage, updatepost)
router.post('/auth', auth)
router.get('/getUser', verifyToken, getUser)
router.get('/getAll', verifyToken, getAll)
router.get('/getAllpost', verifyToken, getAllpost)
router.get('/getById/:id', verifyToken, getById)
router.get('/getLavel', verifyToken, getLavel)
router.get('/verify-token', checkLoginToken)
router.get('/attandance/:id', verifyToken, attendanceGetOne)


module.exports = router