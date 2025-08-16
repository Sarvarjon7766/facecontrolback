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
			// Hozirgi vaqt
			const eventTime = new Date()

			// UTC bo‘yicha bugungi kunning bosh va oxiri
			const startOfDay = new Date(Date.UTC(
				eventTime.getUTCFullYear(),
				eventTime.getUTCMonth(),
				eventTime.getUTCDate(),
				0, 0, 0, 0
			))

			const endOfDay = new Date(Date.UTC(
				eventTime.getUTCFullYear(),
				eventTime.getUTCMonth(),
				eventTime.getUTCDate(),
				23, 59, 59, 999
			))


			const isEntering = Number(data.where) === 2

			// PostLog olish yoki yaratish
			const postlog = await postLogModel.findOneAndUpdate(
				{ post: Number(data.where) },
				{ $setOnInsert: { post: Number(data.where) } },
				{ new: true, upsert: true }
			)

			// Foydalanuvchini topish
			const user = await userModel.findOne({ hodimID: data.employee_id })
			if (!user) return { success: false, message: "Foydalanuvchi topilmadi" }

			// Bugungi attendance olish
			let attendance = await attandanceModel.findOne({
				user: user._id,
				date: { $gte: startOfDay, $lte: endOfDay }
			})

			// === KIRISH BLOKI ===
			if (isEntering) {
				if (attendance && attendance.status === 'ishda') {
					return { success: false, message: "Foydalanuvchi hali chiqmagan" }
				}

				if (!attendance) {
					attendance = await attandanceModel.create({
						user: user._id,
						date: eventTime,
						status: 'ishda',
						totalTime: "0:00",
						totalEntries: 1
					})
				} else {
					attendance.status = 'ishda'
					attendance.totalEntries += 1
					await attendance.save()
				}

				await attandanceLogModel.create({
					user: user._id,
					date: eventTime,
					checkin: true,
					checkout: false,
					checkInTime: eventTime
				})

			} else {
				// === CHIQISH BLOKI ===
				if (!attendance || attendance.status === 'tashqarida') {
					return { success: false, message: "Kirish topilmadi" }
				}

				const openLog = await attandanceLogModel.findOne({
					user: user._id,
					date: { $gte: startOfDay, $lte: endOfDay },
					checkin: true,
					checkout: false
				})
				if (!openLog) return { success: false, message: "Kirish logi topilmadi" }

				openLog.checkout = true
				openLog.checkOutTime = eventTime
				await openLog.save()

				const workMs = openLog.checkOutTime - openLog.checkInTime
				const prevParts = attendance.totalTime.split(":").map(Number)
				const prevMinutes = prevParts[0] * 60 + prevParts[1]
				const totalMinutes = prevMinutes + Math.floor(workMs / 60000)
				const hours = Math.floor(totalMinutes / 60)
				const minutes = totalMinutes % 60

				attendance.status = 'tashqarida'
				attendance.totalTime = `${hours}:${minutes.toString().padStart(2, '0')}`
				await attendance.save()
			}

			// Postlog yangilash
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