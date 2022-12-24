const db = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Student = db.student;

module.exports = {
    register: async (req, res) => {
        const { name, email, password, gender, mobile } = req.body;
        const existingUser = await Student.findOne({ where: { email: email } });
        console.log(existingUser, name)
        if (existingUser === null) {
            return bcrypt.hash(password, 11, (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    const newUser = { name, email, password: hash, mobile, gender };
                    Student.create(newUser)
                        .then((user) => {
                            res.status(201).json({
                                message: "student created successfully",
                                student: {
                                    email: user.email,
                                },
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(400).json({
                                message: "server error occurd",
                            });
                        });
                };
            });
        } else {
            res.status(400).json({
                message: "student already registered",
            });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        const student = await Student.findOne({ where: { email: email } });
        if (student === null) {
            res.status(404).json({
                message: "User Not Found",
            });
        } else {
            bcrypt.compare(password, student.password, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (!result) {
                        res.status(204).json({
                            message: "Password Not Matched",
                        });
                    } else {
                        const userData = {
                            id: student.id,
                            email: student.email,
                        };
                        const token = jwt.sign(userData, process.env.SECRET, {
                            expiresIn: "1d",
                        });
                        res.status(200).json({
                            message: "Login Successfully",
                            token,
                        });
                    };
                };
            });
        };
    },
    loggedInStudent: async (req, res) => {
        const { email } = req.user;
        const student = await Student.findOne({
            where: { email: email },
            attributes: ["email", "name", "role", "status"] ,
        });
        res.status(200).json(student)
    },
    updateById: async (req, res) => {
        const id = req.params.id;
        const updatedStudent = await Student.update(req.body, { where: { id: id } });
        if (updatedStudent[0] > 0) {
            res.status(200).json({
                message: "Updated Successfully",
            });
        } else {
            res.status(404).json({
                message: "Student Not Found",
            });
        };
    },
    deleteById: async (req, res) => {
        const id = req.params.id;
        const deletedStudent = await Student.destroy({ where: { id: id } });
        if (deletedStudent > 0) {
            res.status(200).json({
                message: "Student Deleted Successfully",
            });
        } else {
            res.status(404).json({
                message: "Student Not Found",
            });
        };
    }
};