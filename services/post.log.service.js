const { model } = require('mongoose')
const postLogModel = require('../models/post.log.model')


class PostLogService {
	async getAll() {
		try {
			const log = await postLogModel
				.find()
				.sort({ updatedAt: -1 })
				.limit(50)

			return {
				success: true,
				message: "Oxirgi kirgan xodimlar",
				log
			}
		} catch (error) {
			console.error("getAll error:", error)
			return {
				success: false,
				message: "Server xatosi",
				error: error.message
			}
		}
	}
	async getByPost(id) {
		try {
			const log = await postLogModel
				.findOne({ post: id })
				.sort({ updatedAt: -1 })
				.limit(1)

			return {
				success: true,
				message: "Oxirgi kirgan xodimlar",
				log
			}
		} catch (error) {
			console.error("getAll error:", error)
			return {
				success: false,
				message: "Server xatosi",
				error: error.message
			}
		}
	}
	async create(data) {
		try {
			const log = await postLogModel.create(data)
			if (log) {
				return { success: true, message: "Log qo'shildi" }
			} else {
				return { success: false, message: "Log qo'shishda xatolik" }
			}
		} catch (error) {
			return {
				success: false,
				message: "Server xatosi",
				error: error.message
			}
		}
	}

}

module.exports = new PostLogService()