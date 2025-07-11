const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  expiry: { type: Date, required: true },
 
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
