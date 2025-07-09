const express = require('express');
const router = express.Router();
const FormRegister = require('../models/formRegister');  // Import the form model

// POST request to register student data
router.post('/', async (req, res) => {
  try {
    // Logging the request body to check if the data is received
    console.log(req.body);

    // Check if a form with this email already exists
    const existing = await FormRegister.findOne({ studentEmail: req.body.studentEmail });
    if (existing) {
      return res.status(400).json({ message: 'A student with this email has already registered.' });
    }

    const newStudent = new FormRegister({
      studentName: req.body.studentName,
      studentId: req.body.studentId,
      studentEmail: req.body.studentEmail,
      studentPhone: req.body.studentPhone,
      studentDept: req.body.studentDept,
      studentProgram: req.body.studentProgram,
      studentBatch: req.body.studentBatch,
      studentSemester: req.body.studentSemester,
      studentGender: req.body.studentGender,
      emergencyName: req.body.emergencyName,
      emergencyNumber: req.body.emergencyNumber,
      studentAddress: req.body.studentAddress,
      studentRoute: req.body.studentRoute,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering student', error: error.message });
  }
});

// GET request to fetch all registered students
router.get('/', async (req, res) => {
  try {
    const students = await FormRegister.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// DELETE request to delete a student by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await FormRegister.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

module.exports = router;
