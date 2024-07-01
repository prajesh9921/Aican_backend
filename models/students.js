const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: false,
    },
    contactdetails: {
      type: String,
      required: false,
    },
    feespaid: {
      type: String,
      required: false,
    },
    classselected: {
      type: String,
      required: true,
    },
  },
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
