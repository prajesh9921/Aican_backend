const Class = require("../models/class");
const Student = require("../models/students");
const Teacher = require("../models/teachers");

const GetAllClass = async (req, res) => {
  try {
    const response = await Class.find({});
    res.status(200).json({ data: response });
  } catch (error) {
    console.log("error getting all classes", error);
  }
};

const GetAllTeachers = async (req, res) => {
  try {
    const response = await Teacher.find({});
    res.status(200).json({ data: response });
  } catch (error) {
    console.log("error getting all classes", error);
  }
};

const UpdateTeacherByClass = async (assignedClassId, teacherId) => {
  try {
    const updatedClass = await Teacher.findByIdAndUpdate(
      teacherId,
      { assignedclass: assignedClassId }
    );

    if (!updatedClass) {
      throw new Error('Class not found');
    }
  } catch (error) {
    console.error('Error updating class:', error);
  }
};

const AddClass = async (req, res, next) => {
  const { className, studentFees, year, teachers } = req.body;

  if (!className || !studentFees) {
    return res
      .status(400)
      .json({ message: "bad request: required name and studentfees" });
  }

  const newClass = new Class({
    name: className,
    year: year,
    teacher: teachers,
    studentfees: studentFees,
    studentlist: []
  });

  await newClass
    .save()
    .then(resposne => {
      UpdateTeacherByClass(resposne._id, teachers)
      res.json({ message: "Class added successfully" });
    })
    .catch(err => {
      next(err);
    });
};

const UpdateClassByTeacher = async (assignedClassId, teacherId) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      assignedClassId,
      { teacher: teacherId },
    );

    if (!updatedClass) {
      throw new Error('Class not found');
    }
  } catch (error) {
    console.error('Error updating class:', error);
  }
};

const AddTeacher = async (req, res, next) => {
  const { name, gender, dob, contactdetails, salary, assignedclass } = req.body;

  if (!name || !gender) {
    return res
      .status(400)
      .json({ message: "bad request: required name and gender" });
  }

  const newTeacher = new Teacher({
    name: name,
    gender: gender,
    dob: dob,
    contactdetails: contactdetails,
    salary: salary,
    assignedclass: assignedclass
  });

  await newTeacher
    .save()
    .then(resposne => {
      UpdateClassByTeacher(assignedclass, resposne?._id)
      res.json({ message: "Teacher added successfully" });
    })
    .catch(err => {
      next(err);
    });
};

const UpdateClassByStudent = async (assignedclass, id) => {
  await Class.findByIdAndUpdate(assignedclass, {
    $push: { studentlist: id }
  });
};

const AddStudent = async (req, res, next) => {
  const {
    name,
    gender,
    dob,
    contactdetails,
    feespaid,
    assignedclass
  } = req.body;

  if (!name || !gender || !assignedclass) {
    return res.status(400).json({
      message: "bad request: required name and gender and classselected"
    });
  }

  const newStudent = new Student({
    name: name,
    gender: gender,
    dob: dob,
    contactdetails: contactdetails,
    feespaid: feespaid,
    classselected: assignedclass
  });

  await newStudent
    .save()
    .then(resposne => {
      UpdateClassByStudent(assignedclass, resposne?._id);
      res.status(200).json({ message: "Student added successfully"});
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  GetAllClass,
  AddClass,
  AddTeacher,
  AddStudent,
  GetAllTeachers
};
