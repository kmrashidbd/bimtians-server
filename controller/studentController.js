const db = require("../model");
const { Op } = require('sequelize');

const Student = db.student;
const Personal = db.personal_info;
const Employment = db.employment_info;
const Others = db.others_info;
const ContactRequest = db.contact_request;


module.exports = {
  getAllStudent: async (req, res) => {
    const students = await Student.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Personal,
          as: "personal_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
        {
          model: Employment,
          as: "employment_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
        {
          model: Others,
          as: "others_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
      ],
    });
    if (students.length > 0) {
      res.status(200).json(students);
    } else {
      res.status(203).json({
        message: "No Student Found",
      });
    }
  },
  getStudentsByName: async (req, res) => {
    const { name, intake, course } = req.body;
    let filters;
    if (!intake) {
      filters = {
        name: { [Op.like]: `%${name}%` },
        status: 'active'
      }
    } else {
      filters = {
        course,
        intake,
        status: 'active'
      }
    }
    const students = await Student.findAll({
      where: filters,
      attributes: { exclude: ["password", "role", "createdAt", "updatedAt"] },
      include: [
        {
          model: Personal,
          as: "personal_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
        {
          model: Employment,
          as: "employment_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
        {
          model: Others,
          as: "others_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
      ],
    });
    if (students.length > 0) {
      res.status(200).json(students)
    } else {
      res.status(400).json({
        message: 'Student Not Found'
      })
    }
  },
  getStudentByEmployment: async(req, res)=>{
    const company = req.params.name;
    const result = await Employment.findAll({
      where: {
        companyName: company
      },
      include:[
        {
          model: Student,
          as: "student",
          attributes: ["id", "name"],
        }
      ],
      attributes: { exclude: ["id","studentId"] }
    })
    res.send(result)
  },
  getStudentById: async (req, res) => {
    const id = req.params.id;
    const student = await Student.findOne({
      where: { id: id },
      attributes: { exclude: ["id", "password"] },
      include: [
        {
          model: Personal,
          as: "personal_info", //same as models/index.js
          attributes: { exclude: ["id", "studentId"] },
        },
        {
          model: Employment,
          as: "employment_info", //same as models/index.js
          attributes: { exclude: ["studentId"] },
        },
        {
          model: Others,
          as: "others_info", //same as models/index.js
          attributes: { exclude: ["id", "studentId"] },
        },
        {
          model: ContactRequest,
          as: "contact_request", //same as models/index.js
          // attributes: { exclude: ["studentId"] },
        },
      ],
    });
    if (student !== null) {
      res.status(200).json(student);
    } else {
      res.status(400).json({
        message: "Student Not Found",
      });
    }
  },
  addStudentPersonalDetails: async (req, res) => {
    const studentId = req.user.id;
    const newStudentDetails = { studentId, ...req.body };
    const registerd = await Personal.findOne({ where: { studentId: studentId } });
    if (registerd !== null) {
      return res.status(400).json({
        message: "Personal Details Already Added",
      });
    } else {
      const details = await Personal.create(newStudentDetails);
      res.status(201).json(details);
    }
  },
  updateStudentDetails: async (req, res) => {
    const { id } = req.user;
    const result = await Personal.update(req.body, { where: { studentId: id } });
    if (result[0] > 0) {
      res.status(201).json({
        message: "Updated Successfully",
      });
    } else {
      res.status(400).json({
        message: "Internal Server Error",
      });
    }
  },
  updateBasic: async (req, res) => {
    const { id } = req.user;
    console.log(req.body)
    const result = await Student.update(req.body, { where: { id: id } });
    if (result[0] > 0) {
      res.status(201).json({
        message: "Updated Successfully",
      });
    } else {
      res.status(400).json({
        message: "Internal Server Error",
      });
    }
  },
  editPhoto: async (req, res) => {
    const { id } = req.user;

    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false,
      });
    } else {
      const host = req.get('host');
      const filePath = req.protocol + "://" + host + "/" + req.file.path.replace(/\\/g, "/");
      const result = await Personal.update({ photo: filePath }, { where: { studentId: id } });
      if (result[0] > 0) {
        res.status(200).json({
          message: 'Photo Uploaded Successfully'
        })
      } else {
        res.status(500).json({
          message: 'server error occurd'
        })
      }
    }
  },
};
