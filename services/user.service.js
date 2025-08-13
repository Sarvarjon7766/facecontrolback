const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const attandanceModel = require('../models/attandance.model')

class UserService {
	async register(data, id) {
		try {
			const { username, password } = data
			const existingUser = await userModel.findOne({ username })
			if (existingUser) {
				return {
					success: false,
					message: "Bu foydalanuvchi nomi allaqachon ro'yxatdan o'tgan",
				}
			}
			const saltRounds = 10
			const hashedPassword = await bcrypt.hash(password, saltRounds)

			const user = await userModel.create({
				...data,
				password: hashedPassword,
				createdBy: id
			})

			return {
				success: true,
				message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi",
				user
			}
		} catch (error) {
			console.error("Register xatoligi:", error)
			return {
				success: false,
				message: "Serverda xatolik yuz berdi",
				error: error.message
			}
		}
	}
	async registerpost(data, id) {
		try {
			const { username, password } = data
			const existingUser = await userModel.findOne({ username })
			if (existingUser) {
				return {
					success: false,
					message: "Bu foydalanuvchi nomi allaqachon ro'yxatdan o'tgan",
				}
			}
			const saltRounds = 10
			const hashedPassword = await bcrypt.hash(password, saltRounds)

			const user = await userModel.create({
				...data,
				password: hashedPassword,
				createdBy: id
			})

			return {
				success: true,
				message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi",
				user
			}
		} catch (error) {
			console.error("Register xatoligi:", error)
			return {
				success: false,
				message: "Serverda xatolik yuz berdi",
				error: error.message
			}
		}
	}
	async update(id, data) {
		try {
			const user = await userModel.findByIdAndUpdate(id, data, { new: true })
			if (user) {
				console.log(user)
				return { success: true, message: "Xodimning ma'lumotlari yangilandi" }
			} else {
				return { success: false, message: "Xodimning ma'lumotlarini yangilashda xatolik" }
			}

		} catch (error) {
			return {
				success: false,
				message: "Serverda xatolik yuz berdi",
				error: error.message
			}
		}
	}
	async updatepost(id, data) {
		try {
			const user = await userModel.findByIdAndUpdate(id, data, { new: true })
			if (user) {
				console.log(user)
				return { success: true, message: "Xodimning ma'lumotlari yangilandi" }
			} else {
				return { success: false, message: "Xodimning ma'lumotlarini yangilashda xatolik" }
			}

		} catch (error) {
			return {
				success: false,
				message: "Serverda xatolik yuz berdi",
				error: error.message
			}
		}
	}

	async auth({ username, password }) {
		try {
			const user = await userModel.findOne({ username })
			if (!user) {
				return { success: false, message: "Bunday foydalanuvchi nomi mavjud emas" }
			}
			const isPasswordMatch = await bcrypt.compare(password, user.password)
			if (!isPasswordMatch) {
				return { success: false, message: "Parol noto‘g‘ri" }
			}
			const token = jwt.sign(
				{ userId: user._id, username: user.username, role: user.role },
				process.env.JWT_SECRET || 'defaultsecret',
				{ expiresIn: '1d' }
			)
			return {
				success: true,
				message: "Muvaffaqiyatli tizimga kirildi",
				token,
				role: user.role,
				user: {
					_id: user._id,
					username: user.username
				}
			}
		} catch (error) {
			console.error("Auth xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getUser(data) {
		try {
			const user = await userModel.findById(data.userId)
			if (user) {
				return { success: true, message: "Foydalanuvchi ma'lumotlari", user }
			} else {
				return { success: false, message: "Foydalanuvchi ma'lumoti topilmadi", user: {} }
			}
		} catch (error) {
			console.error("Foydalanuvchi ma'lumotlari xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAll() {
		try {
			const startOfDay = new Date()
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = new Date()
			endOfDay.setHours(23, 59, 59, 999)

			// Barcha foydalanuvchilar
			const users = await userModel.find().populate('department')

			// Bugungi davomat yozuvlari
			const attendances = await attandanceModel.find({
				date: { $gte: startOfDay, $lte: endOfDay }
			})

			// Attendance Map tuzish
			const attendanceMap = attendances.reduce((map, a) => {
				map[a.user.toString()] = a
				return map
			}, {})

			// Har bir foydalanuvchiga status qo‘shish
			const usersWithAttendance = users.map(user => {
				const attendance = attendanceMap[user._id.toString()]
				let attendanceStatus = "kelmagan"

				if (attendance) {
					if (attendance.status === "tashqarida") attendanceStatus = "tashqarida"
					else if (attendance.status === "ishda") attendanceStatus = "ishda"
					else attendanceStatus = attendance.status || attendanceStatus
				}

				return {
					...user.toObject(),
					attendanceStatus
				}
			})

			return { success: true, users: usersWithAttendance }

		} catch (error) {
			console.error("getAll xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}

	async getAllpost() {
		try {
			const startOfDay = new Date()
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = new Date()
			endOfDay.setHours(23, 59, 59, 999)
			const users = await userModel.find({ role: 'post' }).populate('department')

			const userIds = users.map(u => u._id)

			const attendances = await attandanceModel.find({
				user: { $in: userIds },
				date: { $gte: startOfDay, $lte: endOfDay }
			})

			const attendanceMap = new Map()
			attendances.forEach(a => {
				attendanceMap.set(a.user.toString(), a)
			})

			const usersWithAttendance = users.map(user => {
				const attendance = attendanceMap.get(user._id.toString())
				let attendanceStatus = "kelmagan"

				if (attendance) {
					if (attendance.status === "tashqarida") attendanceStatus = "tashqarida"
					else if (attendance.status === "ishda") attendanceStatus = "ishda"
					else attendanceStatus = attendance.status || attendanceStatus
				}

				return {
					...user.toObject(),
					attendanceStatus
				}
			})

			return { success: true, users: usersWithAttendance }
		} catch (error) {
			console.error("getAll xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getById(id) {
		try {
			const startOfDay = new Date()
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = new Date()
			endOfDay.setHours(23, 59, 59, 999)

			// Foydalanuvchini topish va bo‘limni ham olish
			const user = await userModel.findById(id).populate('department').lean()
			if (!user) {
				return { success: false, message: "Foydalanuvchi topilmadi." }
			}

			// Bugungi davomatni olish
			const attendance = await attandanceModel.findOne({
				user: id,
				date: { $gte: startOfDay, $lte: endOfDay }
			}).lean()
			console.log(attendance)

			const attendanceStatus = attendance ? attendance.status : "kelmadi"

			return {
				success: true,
				user: {
					...user,
					attendanceStatus
				}
			}
		} catch (error) {
			console.error("getById xatolik:", error)
			return { success: false, message: "Server xatosi", error: error.message }
		}
	}



	async attandance(id) {
		try {
			const users = await userModel.find().populate('department')
			return { success: true, users: users ? users : [] }
		} catch (error) {
			console.error("getAll xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}

}
module.exports = new UserService()