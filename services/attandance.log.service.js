const attandanceLogModel = require('../models/attandance.log.model')
const attandanceModel = require('../models/attandance.model')
const userModel = require('../models/user.model')

class AttandanceLogService {
	async checkInAttandance(faceDetection) {
		try {
			const today = new Date().toISOString().split("T")[0]
			let user = null

			if (faceDetection) {
				user = await userModel.findOne({ faceDetection })
			}
			if (!user && cardDetection) {
				user = await userModel.findOne({ cardDetection })
			}
			if (!user) {
				return { success: false, message: "Xodim topilmadi" }
			}
			const existLog = await attandanceLogModel.findOne({
				date: today,
				user: user._id,
				checkOutTime: null

			})

			if (existLog) {
				return { success: true, message: "Xodim davomatdan o'tgan" }
			}

			const newAttandancelog = await attandanceLogModel.create({
				date: today,
				user: user._id,
				checkInTime: new Date(),
				checkOutTime: null
			})
			if (newAttandancelog) {
				const attandance = await attandanceModel
			}
			return { success: true, message: "Davomat muvaffaqiyatli qayd etildi", user }

		} catch (error) {
			console.error(error)
			return { success: false, message: "Xatolik yuz berdi" }
		}
	}

	async checkOutAttandance(data) {
		try {

		} catch (error) {

		}
	}
}
module.exports = new AttandanceLogService()