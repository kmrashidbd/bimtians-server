const db = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require('../lib/handlebars');

const Student = db.student;
const AcademicInfo = db.academic_info;

const deleteExists = async (id, dbName) => {
    const exists = await dbName.findOne({ where: { studentId: id } });
    if (exists) {
        const deleted = await dbName.destroy({ where: { studentId: id } })
        return deleted;
    } else {
        return 'Not Found'
    }
};

const sendMail = (mailOptions, res) => {
    return transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.status(200).json({
                message: 'Email Sent on Registered Email'
            })
        }
    });
};

module.exports = {
    register: async (req, res) => {
        const { name, email, password, course, intake, gender, mobile, academicStatus, passingYear } = req.body;
        const existingUser = await Student.findOne({ where: { email: email } });
        if (existingUser === null) {
            return bcrypt.hash(password, 11, (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    const newUser = { name, email, password: hash, mobile, gender, course, intake, academicStatus, passingYear };
                    Student.create(newUser)
                        .then(async (user) => {
                            AcademicInfo.create({
                                studentId: user.id,
                                studentName: name,
                                course,
                                intake,
                                status: academicStatus,
                                passingYear
                            })
                            res.status(201).json({
                                message: "student created successfully",
                                student: {
                                    email: user.email,
                                },
                            });
                            const emails = await Student.findAll({
                                where: {
                                    role: ['moderator', 'admin']
                                },
                                attributes:['email', "name"]
                            });
                            emails.forEach(data => {
                                const mailOptions = {
                                    from: 'BIMTian <noreply@bimtian.org>',
                                    to: data.email,
                                    subject: 'New User Registration Info',
                                    template: 'template',
                                    context: {
                                        user: data.name,
                                        text: `There are one new BIMTian, Mr/Mrs ${user.name} are registered on BIMTian Website. Please Review His/Her ID.`,
                                        image: `https://www.bimtian.org/static/media/bimtian.72f237f6cd3b8e806913.png`
                                    }
                                };
                                sendMail(mailOptions, res)                             
                            });
                            const regMailOptions = {
                                from: 'BIMTian <noreply@bimtian.org>',
                                to: user.email,
                                subject: 'BIMTian Registration Info',
                                template: 'template',
                                context: {
                                    user: user.name,
                                    text: `Welcome to BIMTian, Your Id is under verification. Please Wait for confirmation and update your personal info for helping verification proccess, Thanks`,
                                    image: `https://www.bimtian.org/static/media/bimtian.72f237f6cd3b8e806913.png`
                                }
                            };
                            sendMail(regMailOptions, res)  
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
                        if (!student.numericId) {
                            let numericId = [];
                            (async function () {
                                const numeric = await Student.findAll({
                                    attributes: ["numericId"],
                                })
                                numeric.map(nu => nu.numericId > 1000 && numericId.push(nu.numericId));
                                await Student.update({ numericId: Math.max(...numericId) + 1 }, {
                                    where: { email: email },
                                });
                            })();
                        }
                        const userData = {
                            id: student.id,
                            email: student.email,
                            name: student.name
                        };
                        const token = jwt.sign(userData, process.env.SECRET);
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
        const student = await Student.findOne({
            where: {id},
            attributes: ['email', 'name']
        })
        const updatedStudent = await Student.update(req.body, { where: { id: id } });
        if (updatedStudent[0] > 0) {
            res.status(200).json({
                message: "Updated Successfully",
            });
            const mailOptions = {
                from: 'BIMTian <noreply@bimtian.org>',
                to: student.email,
                subject: 'Password Reset Request',
                template: 'template',
                context: {
                    user: student.name,
                    text: `Your ID is updated. please check your id info.`,
                    image: `https://www.bimtian.org/static/media/bimtian.72f237f6cd3b8e806913.png`
                }
            };
            sendMail(mailOptions, res)
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
            deleteExists(id, db.academic_info);
            deleteExists(id, db.employment_info);
            deleteExists(id, db.others_info);
            deleteExists(id, db.personal_info);
            res.status(200).json({
                message: "Student Deleted Successfully",
            });
        } else {
            res.status(404).json({
                message: "Student Not Found",
            });
        };
    },
    adminPanel: async(req, res)=>{
        const admins = await Student.findAll({
            where: {
                role: ['moderator', 'admin']
            },
            attributes: ['id', 'name', 'photo', 'numericId', 'role', 'gender']
        }); 
        res.status(200).json(admins)
    },
    changePassword: async (req, res) => {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;
        try {
            const existingUser = await Student.findOne({ where: { id: id } });
            bcrypt.compare(currentPassword, existingUser.password, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        message: 'Server Side Error'
                    })
                } else {
                    if (!result) {
                        return res.status(400).json({
                            message: 'Current Passsword Not Matched!'
                        })
                    } else {
                        bcrypt.hash(newPassword, 11, (err, hash) => {
                            if (!err) {
                                Student.update({ password: hash }, { where: { id: id } })
                                    .then(result => {
                                        console.log(result);
                                        res.status(200).json({
                                            message: "Password change Successfully",
                                        });
                                    })
                                    .catch(err => console.log(err))
                            } else {
                                console.log(err)
                            }
                        })
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
    forgotPassword: async (req, res) => {
        const email = req.params.email;
        const student = await Student.findOne({ where: { email: email } });
        if (student !== null) {
            const mailOptions = {
                from: 'BIMTian <noreply@bimtian.org>',
                to: email,
                subject: 'Password Reset Request',
                template: 'passwordReset',
                context: {
                    user: student.name,
                    text: req.body.text,
                    link: `www.bimtian.org/forgotPasss/${student.id}/reset`,
                    image: `https://www.bimtian.org/static/media/bimtian.72f237f6cd3b8e806913.png`
                }
            };
            sendMail(mailOptions, res)
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