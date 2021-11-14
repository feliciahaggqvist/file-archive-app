const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  uploaded_by: {
    type: String,
  },
  mimetype: {
    type: String,
    required: true,
  },

  uploaded_at: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("FileSchema", FileSchema);
