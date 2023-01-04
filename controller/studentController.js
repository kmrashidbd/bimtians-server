const db = require("../model");
const { Op } = require('sequelize');
const multer = require("multer");
const fs = require('fs');
const url = require('url');
const path = require('path')

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
    }
  },
  getStudentsByName: async (req, res) => {
    const name = req.params.name;
    const students = await Student.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        status: 'active'
      },
      attributes: { exclude: ["password", "role", "createdAt", "updatedAt"] },
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
    if(students.length>0){
      res.status(200).json(students)
    }else{
      res.status(400).json({
        message: 'Student Not Found'
      })
    }
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
          attributes: { exclude: ["id", "student"] },
        },
        {
          model: Employment,
          as: "employment_info", //same as models/index.js
          attributes: { exclude: ["id", "student"] },
        },
        {
          model: Academic,
          as: "academic_info", //same as models/index.js
          attributes: { exclude: ["id", "student"] },
        },
        {
          model: Others,
          as: "others_info", //same as models/index.js
          attributes: { exclude: ["id", "student"] },
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
    const student = req.user.id;
    const newStudentDetails = { student, ...req.body };
    const registerd = await Personal.findOne({ where: { student: student } });
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
    const result = await Personal.update(req.body, { where: { student: id } });
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
      const result = await Personal.update({ photo: filePath }, { where: { student: id } });
      if(result[0]>0){
        res.status(200).json({
          message: 'Photo Uploaded Successfully'
        })
      }else{
        res.status(500).json({
          message: 'server error occurd'
        })
      }
    }
  },
};
