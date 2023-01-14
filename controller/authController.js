const db = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const nodemailerMailgun = require('nodemailer-mailgun-transport');

const Student = db.student;


module.exports = {
    register: async (req, res) => {
        const { name, email, password, course, intake, gender, mobile } = req.body;
        const existingUser = await Student.findOne({ where: { email: email } });
        console.log(existingUser, name)
        if (existingUser === null) {
            return bcrypt.hash(password, 11, (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    const newUser = { name, email, password: hash, course, intake, mobile, gender };
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
            attributes: ["id", "email", "name", "role", "status"],
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
    },
    forgotPassword: async (req, res) => {
        const email = req.params.email;
        const student = await Student.findOne({ where: { email: email } });
        if (student !== null) {
            const auth = {
                auth: {
                    api_key: '94135017511fbca2326ecd3f017f621b-8845d1b1-62e6e355',
                    domain: 'sandboxf01a3a3f60d347449099a868da7be685.mailgun.org'
                }
            }
            // const transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'kazi299499@gmail.com',
            //         pass: 'kghjsgpkgygshrry'
            //     }
            // });
            const transporter = nodemailer.createTransport(nodemailerMailgun(auth))
            const mailOptions = {
                from: 'Exited User <noreply@example.mailgun.org>',
                to: email,
                subject: 'Sending Email using nodemailer mailgun Node.js',
                text: 'That was easy!',
                html: `
                <p>For clients that do not support AMP4EMAIL or amp content is not valid</p><br>
                <a href="http://localhost:3000/forgotPasss/${student?.id}/reset">Reset Password</a>
                `
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({
                        message: 'Email Sent on Registered Email'
                    })
                }
            });
        } else {
            res.status(400).json({
                message: 'Student Not Found'
            })
        }
    },
    resetPassword: async (req, res) => {
        const id = req.params.id;
        const password = req.body.password;
        bcrypt.hash(password, 11, (err, hash) => {
            if (!err) {
                Student.update({ password: hash }, { where: { id: id } })
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: "Password Reset Successfully",
                        });
                    })
                    .catch(err => console.log(err))
            } else {
                console.log(err)
            }
        })
    }
};