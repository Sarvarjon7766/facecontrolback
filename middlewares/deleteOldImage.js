const fs = require('fs')
const path = require('path')
const User = require('../models/user.model.js')

const deleteOldImage = async (req, res, next) => {
	try {
		const userId = req.params.id
		const existingUser = await User.findById(userId)

		if (!existingUser) {
			return res.status(404).json({ message: 'Foydalanuvchi topilmadi' })
		}

		// Faqat yangi rasm yuklanganda va eski rasm bo'lsa
		if (req.file && existingUser.photo) {
			const oldImagePath = path.join(process.cwd(), 'uploads', existingUser.photo)

			if (fs.existsSync(oldImagePath)) {
				fs.unlinkSync(oldImagePath) // eski faylni o'chirish
				console.log(`Eski rasm o‘chirildi: ${oldImagePath}`)
			}
		}

		next()
	} catch (err) {
		console.error('Eski rasmni o‘chirishda xatolik:', err)
		next()
	}
}
module.exports = deleteOldImage
