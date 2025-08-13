const userService = require('../services/user.service')
const UserService = require('../services/user.service')
const path = require('path')

const { faceapi, canvas } = require('../middlewares/faceApiMiddleware')

class UserController {
	async register(req, res) {
		try {
			const { username, password } = req.body
			if (!username || !password) {
				return res.status(400).json({
					success: false,
					message: "Barcha majburiy maydonlarni to'ldiring"
				})
			}

			if (!req.user) {
				return res.status(403).json({
					success: false,
					message: "Ruxsat yo‘q"
				})
			}
			const user = await UserService.register(
				{ ...req.body, photo: req.file?.filename || null, faceDetection: null },
				req.user.userId
			)

			if (user.success) {
				return res.status(201).json(user)
			} else {
				return res.status(400).json(user)
			}
		} catch (error) {
			console.error("Register controller xatosi:", error)
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}
	async registerpost(req, res) {
		try {
			const { username, password } = req.body
			if (!username || !password) {
				return res.status(400).json({
					success: false,
					message: "Barcha majburiy maydonlarni to'ldiring"
				})
			}

			if (!req.user) {
				return res.status(403).json({
					success: false,
					message: "Ruxsat yo‘q"
				})
			}
			const user = await UserService.registerpost(
				{ ...req.body, photo: req.file?.filename || null, faceDetection: null },
				req.user.userId
			)

			if (user.success) {
				return res.status(201).json(user)
			} else {
				return res.status(400).json(user)
			}
		} catch (error) {
			console.error("Register controller xatosi:", error)
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}
	async update(req, res) {
		try {
			const result = await UserService.update(req.params.id, { ...req.body, photo: req.file?.filename || null, faceDetection: null })
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error("Register controller xatosi:", error)
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}
	async updatepost(req, res) {
		try {
			const result = await UserService.updatepost(req.params.id, { ...req.body, photo: req.file?.filename || null, faceDetection: null })
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error("Register controller xatosi:", error)
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}


	async auth(req, res) {
		try {
			const result = await userService.auth(req.body)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi"
			})
		}
	}
	async getUser(req, res) {
		try {
			const result = await userService.getUser(req.user)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi"
			})
		}
	}
	async getAll(req, res) {
		try {
			const result = await userService.getAll()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi"
			})
		}
	}
	async getAllpost(req, res) {
		try {
			const result = await userService.getAllpost()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi"
			})
		}
	}
	async getById(req, res) {
		try {
			const result = await userService.getById(req.params.id)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi"
			})
		}
	}
	async attandance(req, res) {
		try {
			const { id } = req.params
			const result = await userService.attandance(id)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Server xatosi"
			})
		}
	}
}
module.exports = new UserController()