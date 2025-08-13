const PostLogService = require('../services/post.log.service')


class PostLogController {
	async getAll(req, res) {
		try {
			console.log("Salom")
			const result = await PostLogService.getAll()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}
	async getByPost(req, res) {
		try {
			const result = await PostLogService.getByPost(req.params.id)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}
	async create(req, res) {
		try {
			console.log(req.body)
			const result = await PostLogService.create(req.body)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}
}

module.exports = new PostLogController()