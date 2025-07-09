const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  profile: {
    name: String,
    email: String,
    phone: String
  },
  notifications: {
    emailAlerts: Boolean,
    smsAlerts: Boolean
  },
  security: {
    twoFactorAuth: Boolean,
    password: String
  },
  systemConfig: {
    maintenanceMode: Boolean,
    appTheme: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setting', settingsSchema);
