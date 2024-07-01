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
    const updatedClass = await Teacher.findByIdAndUpdate(teacherId, {
      assignedclass: assignedClassId,
    });

    if (!updatedClass) {
      throw new Error("Class not found");
    }
  } catch (error) {
    console.error("Error updating class:", error);
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
    studentlist: [],
  });

  await newClass
    .save()
    .then((resposne) => {
      UpdateTeacherByClass(resposne._id, teachers);
      res.json({ message: "Class added successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

const UpdateClassByTeacher = async (assignedClassId, teacherId) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(assignedClassId, {
      teacher: teacherId,
    });

    if (!updatedClass) {
      throw new Error("Class not found");
    }
  } catch (error) {
    console.error("Error updating class:", error);
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
    assignedclass: assignedclass,
  });

  await newTeacher
    .save()
    .then((resposne) => {
      UpdateClassByTeacher(assignedclass, resposne?._id);
      res.json({ message: "Teacher added successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

const UpdateClassByStudent = async (assignedclass, name) => {
  await Class.findByIdAndUpdate(assignedclass, {
    $push: { studentlist: name },
  });
};

const AddStudent = async (req, res, next) => {
  const { name, gender, dob, contactdetails, feespaid, assignedclass } =
    req.body;

  if (!name || !gender || !assignedclass) {
    return res.status(400).json({
      message: "bad request: required name and gender and classselected",
    });
  }

  const newStudent = new Student({
    name: name,
    gender: gender,
    dob: dob,
    contactdetails: contactdetails,
    feespaid: feespaid,
    classselected: assignedclass,
  });

  await newStudent
    .save()
    .then((resposne) => {
      UpdateClassByStudent(assignedclass, name);
      res.status(200).json({ message: "Student added successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

const GetGenderCount = async (req, res) => {
  try {
    let male = 0;
    let female = 0;

    // Fetch teachers and students concurrently
    const [teachers, students] = await Promise.all([
      Teacher.find({}),
      Student.find({})
    ]);

    // Count genders among teachers
    teachers.forEach((teacher) => {
      if (teacher.gender === "Male") {
        male += 1;
      } else if (teacher.gender === "Female") {
        female += 1;
      }
    });

    // Count genders among students
    students.forEach((student) => {
      if (student.gender === "Male") {
        male += 1;
      } else if (student.gender === "Male") {
        female += 1;
      }
    });

    res.status(200).json({ data: { male, female } });
  } catch (error) {
    console.log("Error in getting gender counts:", error);
    res.status(500).json({ error: "Failed to fetch gender counts" });
  }
};

const GetExpense = async (req, res) => {
  try {
    // Fetch teachers and students concurrently
    const [teachers, students] = await Promise.all([
      Teacher.find({}),
      Student.find({})
    ]);

    const spent = teachers.reduce((acc, curr) => acc + parseInt(curr.salary), 0);
    const earned = students.reduce((acc, curr) => acc + parseInt(curr.feespaid), 0);

    res.status(200).json({ data: {spent: spent, earned: earned} });
  } catch (error) {
    console.log("Error in getting gender counts:", error);
  }
};


module.exports = {
  GetAllClass,
  AddClass,
  AddTeacher,
  AddStudent,
  GetAllTeachers,
  GetGenderCount,
  GetExpense
};
