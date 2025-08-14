// index.js
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const multer = require('multer') // Fayl upload uchun
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// DB bilan bog'lanish
const connectDB = require('./config/db')
connectDB()

// Frontend URL va allowed origins
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173']

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true) // Postman yoki serverdan so'rov
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS xatoligi. Origin: ${origin} ruxsat etilmagan.`
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}))

app.use(express.json())

// Static fayllar uchun
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes import
const { userrouter, departamentrouter, eventroute, postlogrouter } = require('./routes/index')

app.use('/api/user', userrouter)
app.use('/api/departament', departamentrouter)
app.use('/api/events', eventroute)
app.use('/api/post', postlogrouter)

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'Fayl yuklashda xatolik: ' + err.message
    })
  }
  console.error(err.stack)
  res.status(500).send('Serverda xatolik yuz berdi!')
})

// Uploads papkasi mavjudligini tekshirish
const fs = require('fs')
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
  console.log('Uploads papkasi yaratildi')
}

// Serverni ishga tushurish
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`)
})
