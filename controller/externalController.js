const db = require('../model');

const Employment = db.employment_info;
const Academic = db.academic_info;
const Others = db.others_info;

module.exports = {
    addEmployment: async (req, res) => {
        const student = req.user;
        const employemnt = {
            student: student.id,
            ...req.body
        };
        const exists = await Employment.findOne({ where: { student: student.id } });
        if (exists !== null) {
            return res.status(400).json({
                message: 'Employment Details Already Added'
            })
        } else {
            const details = await Employment.create(employemnt);
            res.status(201).json(details)
        }
    },
    editEmployment: async (req, res) => {
        const {id} = req.user;
        const result = await Employment.update(req.body, {where: {student: id}});
        console.log(result)
    },
    addAcademic: async (req, res) => {
        const student = req.user;
        const academic = {
            student: student.id,
            ...req.body
        };
        const exists = await Academic.findOne({ where: { student: student.id } });
        if (exists !== null) {
            return res.status(400).json({
                message: 'Academic Details Already Added'
            })
        } else {
            const details = await Academic.create(academic);
            res.status(201).json(details)
        }
    },
    editAcademic: async (req, res) => {

    },
    addOthers: async (req, res) => {
        const student = req.user;
        const others = {
            student: student.id,
            ...req.body
        };
        const exists = await Others.findOne({ where: { student: student.id } });
        if (exists !== null) {
            return res.status(400).json({
                message: 'Others Details Already Added'
            })
        } else {
            const details = await Others.create(others);
            res.status(201).json(details)
        }
    },
    editOthers: async (req, res) => {

    },
};