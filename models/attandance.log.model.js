const { Schema, model, default: mongoose } = require('mongoose')

const attendanceLogSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkin:{
    type:Boolean,
    required:false,
  },
  checkout:{
    type:Boolean,
    required:false
  },
  checkInTime: {
    type: Date,
    required: false
  },
  checkOutTime: {
    type: Date,
    required: false
  },
  comment: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
})

module.exports = model('AttendanceLog', attendanceLogSchema)
