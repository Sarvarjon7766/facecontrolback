const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		const ext = path.extname(file.originalname)
		cb(null, file.fieldname + '-' + uniqueSuffix + ext)
	}
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true)
	} else {
		cb(new Error('Faqat rasm fayllarini yuklash mumkin!'), false)
	}
}

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024
	}
})

module.exports = upload