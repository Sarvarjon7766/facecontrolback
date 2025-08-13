const express = require('express')
const { createDepartament, getAll, updateDepartament } = require('../controllers/departament.controller')
const verifyToken = require('../middlewares/verifyToken')
const router = express.Router()

router.post('/createdepartament', verifyToken, createDepartament)
router.put('/update/:id', verifyToken, updateDepartament)
router.get('/getAll', getAll)

module.exports = router