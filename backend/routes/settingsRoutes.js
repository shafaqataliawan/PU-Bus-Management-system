const express = require('express');
const router = express.Router();
const Setting = require('../models/settingsModel');

// GET settings by admin ID
router.get('/:adminId', async (req, res) => {
  try {
    const settings = await Setting.findOne({ adminId: req.params.adminId });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
});

// UPDATE settings
router.put('/:adminId', async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { adminId: req.params.adminId },
      { $set: req.body },
      { new: true }
    );
    res.json({ message: 'Settings updated successfully!', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error });
  }
});

module.exports = router;
