const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  licenseNumber: String,
  busNumber: String,
  route: String,
  experience: String,
  status: { type: String, default: "Active" },
  joiningDate: Date,
  profileImage: String
});

module.exports = mongoose.model("Driver", driverSchema);
