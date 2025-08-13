const AttandanceService = require('../services/attandance.service')
class AttandanceController {
	async attendanceGetOne(req, res) {
		try {
			const { id } = req.params
			if (!id) {
				return res.status(400).json({ success: false, message: 'Foydalanuvchi ID berilmagan' })
			}

			const result = await AttandanceService.attendanceGetOne(id)
			console.log(result)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(404).json(result)
			}
		} catch (error) {
			console.error('attendanceGetOne controller error:', error)
			return res.status(500).json({ success: false, message: 'Server xatosi' })
		}
	}

	async checkInAttandance(req, res) {
		try {
			console.log(req.body)
			const result = await AttandanceService.checkInAttendance(req.body)

			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}

		} catch (error) {
			console.error('Controller checkInAttandance error:', error)
			return res.status(500).json({
				success: false,
				message: "Server xatosi",
				error: error.message
			})
		}
	}

}


module.exports = new AttandanceController()