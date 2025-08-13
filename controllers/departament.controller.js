const DepartamentService = require('../services/department.service')
class DepartamentController {
	async createDepartament(req, res) {
		try {
			const result = await DepartamentService.createDepartament(req.body)
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server error", error })
		}
	}
	async getAll(req, res) {
		try {
			const result = await DepartamentService.getAll()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server error", error })
		}
	}
	async updateDepartament(req, res) {
		try {
			const result = await DepartamentService.updateDepartament(req.params.id,req.body)
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server error", error })
		}
	}

}
module.exports = new DepartamentController()