const { Schema, model, default: mongoose } = require('mongoose')

const userSchema = new Schema({
	fullName: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
	},
	department: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Department',
		required: false
	},
	role: {
		type: String,
		enum: ['admin', 'viewer', 'post'],
		default: 'viewer'
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	faceDetection: {
		type: String,
		default: null
	},
	cardDetection: {
		type: String,
		default: null
	},
	hodimID: {
		type: String,
		required: true,
		default: 123456
	},
	lavel: {
		type: Number,
		required: true,
	},
	birthday: {
		type: Date
	},
	phone_personal: {
		type: String
	},
	phone_work: {
		type: String
	},
	isEdit: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('User', userSchema)