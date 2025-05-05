const express = require('express');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer setup for profile pic upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// List all employees
/**
 * @route GET /employees
 * @desc Get a list of all employees
 * @access Protected (requires authentication)
 * @returns {Array} List of employee objects
 */
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error('Get employees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /employees
 * @desc Add a new employee
 * @access Protected (requires authentication)
 * @param {string} name - Employee's name (required)
 * @param {string} email - Employee's email (required, unique)
 * @param {string} phone - Employee's phone number (required)
 * @param {string} employeeType - Employee type (Full-Time, Part-Time, Contractor, Intern) (required)
 * @param {file} profilePic - Profile picture file (optional, multipart/form-data)
 * @returns {Object} The created employee object
 */
router.post('/', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, phone, employeeType } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newEmployee = new Employee({
      name,
      email,
      phone,
      employeeType,
      profilePic,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Add employee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    console.error('Get employee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee by ID
router.put('/:id', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, phone, employeeType } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = { name, email, phone, employeeType };
    if (profilePic) updateData.profilePic = profilePic;

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });

    res.json(updatedEmployee);
  } catch (err) {
    console.error('Update employee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('Delete employee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search employees by name or email query param
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const regex = new RegExp(q, 'i'); // case-insensitive
    const employees = await Employee.find({
      $or: [{ name: regex }, { email: regex }]
    });

    res.json(employees);
  } catch (err) {
    console.error('Search employees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
