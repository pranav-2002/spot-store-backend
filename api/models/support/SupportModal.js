const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    maxLength: 100,
  },
  message: {
    type: String,
    required: true,
    maxLength: 500,
  },
});

const Support = mongoose.model("Support", SupportSchema);

module.exports = Support;
