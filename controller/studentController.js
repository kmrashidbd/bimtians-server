const db = require('../model');

const Student = db.student;
const Personal = db.personal_info;
const Employment = db.employment_info;
const Academic = db.academic_info;
const Others = db.others_info;


module.exports = {
  getAllStudent: async (req, res) => {
    const students = await Student.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Personal,
          as: "personal_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Employment,
          as: "employment_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Academic,
          as: "academic_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Others,
          as: "others_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
      ],
    });
    if (students.length > 0) {
      res.status(200).json(students);
    } else {
      res.status(203).json({
        message: "No Student Found",
      });
    };
  },
  getStudentById: async (req, res) => {
    const id = req.params.id;
    const student = await Student.findOne({
      where: {id: id},
      attributes: {exclude: ["password"]},
      include: [
        {
          model: Personal,
          as: "personal_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Employment,
          as: "employment_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Academic,
          as: "academic_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Others,
          as: "others_info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
      ]
    });
    if(student !== null){
      res.status(200).json(student)
    }else{
      res.status(400).json({
        message: 'Student Not Found'
      })
    }
  },
  addStudentPersonalDetails: async (req, res) => {
    const student = req.user.id;
    const newStudentDetails = {student, ...req.body}
    const registerd = await Personal.findOne({where: {student: student}});
    if(registerd !== null){
      return res.status(400).json({
        message: 'Personal Details Already Added'
      })
    }else{
      const details = await Personal.create(newStudentDetails);
      res.status(201).json(details)
    }
  },
  addStudentEmploymentDetails: async (req, res) => {
    
  },
  addStudentAcademicDetails: async (req, res) => {
    
  },
  addStudentOthersDetails: async (req, res) => {
    
  },
  updateStudentDetails: async (req, res) => {

  },
};