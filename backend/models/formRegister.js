const mongoose = require('mongoose');

const formRegisterSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
    unique: true,
  },
  studentPhone: {
    type: String,
    required: true,
  },
  studentDept: {
    type: String,
    required: true,
  },
  studentProgram: {
    type: String,
    required: true,
  },
  studentBatch: {
    type: String,
    required: true,
  },
  studentSemester: {
    type: String,
    required: true,
  },
  studentGender: {
    type: String,
    required: true,
  },
  emergencyName: {
    type: String,
    required: true,
  },
  emergencyNumber: {
    type: String,
    required: true,
  },
  studentAddress: {
    type: String,
    required: true,
  },
  studentRoute: {
    type: String,
    required: true,
  },
});

const FormRegister = mongoose.model('FormRegister', formRegisterSchema);

module.exports = FormRegister;
