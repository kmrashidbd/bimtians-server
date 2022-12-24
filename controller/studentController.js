const db = require('../model');

const Student = db.student;
const Personal = db.personal_info;
const Employment = db.employment_info;
const Others = db.others_info;


module.exports = {
  getAllStudent: async (req, res) => {
    const students = await Student.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Personal,
          as: "personal-info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Employment,
          as: "employment-info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Others,
          as: "others-info", //same as models/index.js
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
          as: "personal-info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Employment,
          as: "employment-info", //same as models/index.js
          attributes: { exclude: ["user"] },
        },
        {
          model: Others,
          as: "others-info", //same as models/index.js
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
  addStudentDetails: async (req, res) => {
    
  },
  updateStudentDetails: async (req, res) => {

  },
};