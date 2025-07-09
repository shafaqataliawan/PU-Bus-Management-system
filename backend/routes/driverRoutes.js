// backend/routes/driverRoutes.js

const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver'); // Make sure this model exists

// TEST ROUTE: To check if this file is loaded
router.get('/test', (req, res) => {
  res.send('Driver route is working!');
});

// ✅ 1. Add Driver
router.post('/add', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.status(201).json({ message: 'Driver added successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add driver', error: err });
  }
});

// ✅ 2. Get All Drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch drivers', error: err });
  }
});

// ✅ 3. Delete Driver by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Driver deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete driver', error: err });
  }
});

// ✅ 4. Toggle Driver Status (Active/Inactive)
router.patch('/toggle/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.status = driver.status === 'Active' ? 'Inactive' : 'Active';
    await driver.save();

    res.status(200).json({ message: 'Driver status updated', status: driver.status });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err });
  }
});

// Update Driver by ID
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json({ message: 'Driver updated successfully!', driver: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update driver', error: err });
  }
});

// ✅ 5. Get Driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch driver', error: err });
  }
});

module.exports = router;
