const db = require("../model");

const Employment = db.employment_info;
const Others = db.others_info;
const Academic = db.academic_info;

module.exports = {
  addEmployment: async (req, res) => {
    const student = req.user;
    const employemnt = {
      studentId: student.id,
      ...req.body,
    };
    const details = await Employment.create(employemnt);
    res.status(201).json(details);
  },
  editEmployment: async (req, res) => {
    const { id } = req.params;
    const result = await Employment.update(req.body, {
      where: { id: id },
    });
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
  deleteEmployment: async (req, res) => {
    const { id } = req.params;
    const result = await Employment.destroy({ where: { id: id } });
    if (result > 0) {
      return res.status(200).json({
        message: 'Successfully Deleted'
      })
    } else {
      res.status(400).json({
        message: 'Not Found'
      })
    }
  },
  addOthers: async (req, res) => {
    const student = req.user;
    const others = {
      studentId: student.id,
      ...req.body,
    };
    const details = await Others.create(others);
    res.status(201).json(details);
  },
  editOthers: async (req, res) => {
    const newData = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      relation: req.body.relation,
      facebook: req.body.facebook,
      whatsApp: req.body.whatsApp,
    }
    const result = await Others.update(newData, {
      where: { id: req.body.id },
    });
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
  deleteOthers: async (req, res) => {
    const { id } = req.params;
    const result = await Others.destroy({ where: { id: id } });
    if (result > 0) {
      return res.status(200).json({
        message: 'Successfully Deleted'
      })
    } else {
      res.status(400).json({
        message: 'Not Found'
      })
    }
  },
  addAcademic: async (req, res) => {
    const student = req.user;
    const academic = {
      studentId: student.id,
      studentName: student.name,
      ...req.body,
    };
    const exist = await Academic.findAll({
      where: { studentId: student.id }
    })
    if (exist.length >= 2) {
      res.status(400).json({
        message: 'Already Put Maximum Number of Course'
      })
    } else {
      const details = await Academic.create(academic);
      res.status(201).json(details);
    }
  },
  editAcademic: async (req, res) => {
    const id = req.params.id;
    const result = await Academic.update(req.body, {
      where: { id: id },
    });
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
  deleteAcademic: async (req, res) => {
    const { id } = req.params;
    const result = await Academic.destroy({ where: { id: id } });
    if (result > 0) {
      return res.status(200).json({
        message: 'Successfully Deleted'
      })
    } else {
      res.status(400).json({
        message: 'Not Found'
      })
    }
  }
};
