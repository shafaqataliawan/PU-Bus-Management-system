const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// POST: Create a new announcement
router.post('/add', async (req, res) => {
  try {
    const { title, description, date, expiry, day } = req.body;
    const newAnnouncement = new Announcement({ title, description, date, expiry, });
    await newAnnouncement.save();
    res.status(201).json({ message: 'Announcement saved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET: Fetch all announcements
router.get('/get', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT: Update an announcement by ID
router.put('/update:id', async (req, res) => {
  try {
    const { title, description, date, expiry, day } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description, date, expiry, day },
      { new: true } // Return the updated document
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.status(200).json({ message: 'Announcement updated successfully.', updatedAnnouncement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE: Delete an announcement by ID
router.delete('/delete/:id', async (req, res) => {
    try {
      const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
  
      if (!deletedAnnouncement) {
        return res.status(404).json({ message: 'Announcement not found.' });
      }
  
      res.status(200).json({ message: 'Announcement deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  

module.exports = router;
