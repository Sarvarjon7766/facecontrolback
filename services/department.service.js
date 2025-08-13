const departamentModel = require('../models/department.model')
class DepartamentService {
	async createDepartament(data) {
		try {
			const { name } = data
			const exsistDepartament = await departamentModel.findOne({ name })
			if (exsistDepartament) {
				return { success: false, message: "Bunday nom bilan bo'lim qo'shilgan" }
			}
			const department = await departamentModel.create(data)
			if (department) {
				return { success: true, message: "Bo'lim muvafaqiyatli qo'shildi" }
			} else {
				return { success: false, message: "Bo'lim qo'shishda xatolik" }
			}
		} catch (error) {
			return {
				success: false,
				message: "server error",
				error
			}
		}
	}
	async getAll() {
		try {
			const departments = await departamentModel.find().populate('head')
			return { success: true, departments: departments ? departments : [] }
		} catch (error) {
			return {
				success: false,
				message: "server error",
				error
			}
		}
	}
	async updateDepartament(id, data) {
		try {
			const department = await departamentModel.findById(id)

			if (department) {
				department.name = data.name
				department.description = data.description
				department.head = data.head
				await department.save()
			} else {
				await departamentModel.create(data)
			}

			return { success: true }
		} catch (error) {
			console.error("Departament yangilashda xatolik:", error)
			return { success: false, error }
		}
	}


}
module.exports = new DepartamentService()