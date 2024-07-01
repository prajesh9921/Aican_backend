const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  year: {
    type: String,
    required: false
  },
  teacher: {
    type: String,
    required: false
  },
  studentfees: {
    type: String,
    required: true
  },
  studentlist: {
    type: [],
    required: false,
    unique: true
  }
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
