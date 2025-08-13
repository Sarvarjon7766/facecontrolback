const { Schema, model, default: mongoose } = require('mongoose')

const attendanceSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['ishda', 'tashqarida', 'kelmagan'],
    default: 'present'
  },
  totalTime: {
    type: String,
    default: '0:00'
  },
  totalEntries: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
})

module.exports = model('Attendance', attendanceSchema)
