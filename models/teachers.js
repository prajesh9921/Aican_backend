const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: false
  },
  contactdetails: {
    type: String,
    required: false
  },
  salary: {
    type: String,
    required: false
  },
  assignedclass: {
    type: String,
    required: false
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
