const { Schema, model, default: mongoose } = require('mongoose')

const postLogModel = new Schema({
	fullName: {
		type: String,

	},
	position: {
		type: String,

	},
	photo: {
		type: String,
	},
	department: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Department',
	},
	post: {
		type: Number,
		enum: [1, 2],
		default: 1
	},
	typeStatus: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('PostLog', postLogModel)