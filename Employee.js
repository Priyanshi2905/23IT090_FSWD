const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  employeeType: {
    type: String,
    required: true,
    enum: ['Full-Time', 'Part-Time', 'Contractor', 'Intern'],
  },
  profilePic: {
    type: String, // URL or path to uploaded profile picture
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
