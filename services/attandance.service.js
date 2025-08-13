const attandanceLogModel = require('../models/attandance.log.model')
const attandanceModel = require('../models/attandance.model')
const postLogModel = require('../models/post.log.model')
const userModel = require('../models/user.model')

class AttandanceService {

	async attendanceGetOne(userId) {
		try {
			const startOfDay = new Date()
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = new Date()
			endOfDay.setHours(23, 59, 59, 999)

			// Faqat bugungi davomat yozuvlarini olish
			const attendanceRecords = await attandanceModel.find({
				user: userId,
				date: { $gte: startOfDay, $lte: endOfDay }
			})
				.sort({ date: -1 })
				.lean()

			const history = []

			for (const record of attendanceRecords) {
				// Shu kungi barcha kirish/chiqish loglarini olish
				const logs = await attandanceLogModel.find({
					user: userId,
					date: { $gte: startOfDay, $lte: endOfDay }
				}).sort({ date: 1 }).lean()

				// Eng birinchi kirish va eng oxirgi chiqish vaqtlarini aniqlash
				const firstCheckIn = logs.find(log => log.checkin && log.checkInTime)?.checkInTime || null
				const lastCheckOut = [...logs].reverse().find(log => log.checkout && log.checkOutTime)?.checkOutTime || null

				let hoursWorked = 0
				if (firstCheckIn && lastCheckOut) {
					hoursWorked = ((new Date(lastCheckOut) - new Date(firstCheckIn)) / (1000 * 60 * 60)).toFixed(2)
				}

				history.push({
					_id: record._id,
					user: record.user,
					date: record.date,
					status: record.status,
					totalTime: record.totalTime,
					totalEntries: record.totalEntries,
					createdAt: record.createdAt,
					updatedAt: record.updatedAt,
					arrivalTime: firstCheckIn,
					departureTime: lastCheckOut,
					hoursWorked: Number(hoursWorked),
					logs // bugungi barcha kirish/chiqish loglari
				})
			}

			return { success: true, attendanceHistory: history }

		} catch (error) {
			console.error("Attendance history error:", error)
			return { success: false, message: "Server xatosi", error: error.message }
		}
	}

	async checkInAttendance(data) {
		try {
			const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0)
			const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999)

			const isEntering = Number(data.where) === 2
			const status = isEntering ? 'ishda' : 'tashqarida'
			const eventTime = new Date(data.time)

			const postlog = await postLogModel.findOneAndUpdate(
				{ post: Number(data.where) },
				{ $setOnInsert: { post: Number(data.where) } },
				{ new: true, upsert: true }
			)

			const user = await userModel.findOne({ hodimID: data.employee_id })
			if (!user) return { success: false, message: "Foydalanuvchi topilmadi" }

			let attendance = await attandanceModel.findOne({
				user: user._id,
				date: { $gte: startOfDay, $lte: endOfDay }
			})

			if (isEntering) {
				if (!attendance) {
					await attandanceLogModel.create({ user: user._id, date: eventTime, checkin: true, checkInTime: eventTime })
					attendance = await attandanceModel.create({ user: user._id, date: eventTime, status, totalTime: "0:00", totalEntries: 1 })
				} else {
					if (attendance.status === 'ishda') return { success: false, message: "Allaqachon ishda" }
					const existingOpenLog = await attandanceLogModel.findOne({ user: user._id, date: { $gte: startOfDay, $lte: endOfDay }, checkin: true, checkout: false })
					if (existingOpenLog) return { success: false, message: "Oldingi kirish yopilmagan" }
					await attandanceLogModel.create({ user: user._id, date: eventTime, checkin: true, checkInTime: eventTime })
					attendance.status = 'ishda'; attendance.totalEntries += 1; await attendance.save()
				}
			} else {
				if (!attendance) return { success: false, message: "Chiqish uchun davomat topilmadi" }
				if (attendance.status === 'tashqarida') return { success: false, message: "Allaqachon tashqarida" }

				const log = await attandanceLogModel.findOne({ user: user._id, date: { $gte: startOfDay, $lte: endOfDay }, checkin: true, checkout: false })
				if (!log) return { success: false, message: "Kirish logi topilmadi" }

				log.checkout = true; log.checkOutTime = eventTime; await log.save()
				attendance.status = 'tashqarida'
				// Ishlangan vaqtni hisoblash
				const workMs = log.checkOutTime - log.checkInTime
				const totalMinutes = Math.floor(workMs / 60000)
				const hours = Math.floor(totalMinutes / 60)
				const minutes = totalMinutes % 60
				attendance.totalTime = `${hours}:${minutes.toString().padStart(2, '0')}`
				await attendance.save()
			}

			// postlog yangilash
			Object.assign(postlog, {
				fullName: user.fullName,
				position: user.position,
				photo: user.photo,
				department: user.department,
				typeStatus: isEntering
			})
			await postlog.save()

			return { success: true, message: isEntering ? "Kirish qayd etildi" : "Chiqish qayd etildi" }
		} catch (error) {
			console.error('Create attendance error:', error)
			return { success: false, message: "Server error", error: error.message }
		}
	}




}

module.exports = new AttandanceService()