const db = require("../model");

const Student = db.student;
const Employment = db.employment_info;
const Others = db.others_info;
const ContactRequest = db.contact_request;

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
    const exists = await Others.findOne({ where: { studentId: student.id } });
    if (exists !== null) {
      return res.status(400).json({
        message: "Others Details Already Added",
      });
    } else {
      const details = await Others.create(others);
      res.status(201).json(details);
    }
  },
  editOthers: async (req, res) => {
    const { id } = req.user;
    const result = await Others.update(req.body, {
      where: { studentId: id },
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
  createContactRequest: async (req, res) => {
    const id = req.user.id;
    const exists = await ContactRequest.findOne({
      where: {
        requestBy : id,
        requestedTo : req.params.id
      }
    });
    if (exists !== null) {
      return res.status(400).json({
        message: 'Request Already Sent'
      })
    } else {
      const newRequest = await ContactRequest.create({
        requestBy : id,
        requestedTo : req.params.id
      });
      console.log(newRequest)
      res.status(200).json({
        message: 'Request Successfully Sent',
      })
    }
  },
  getSingleUserContactRequest: async (req, res) => {
    const id = req.user.id;
    const requests = await ContactRequest.findAll({
      where: {
        requestedTo: id
      },
      include: [
        {
          model: Student,
          as: "student",
          attributes: ['name', 'course', 'intake'],
        },
      ],
      attributes: { exclude: ["requestBy", "requestedTo"] },
    })
    res.status(200).json(requests)
  },
  getAllContactRequest: async (req, res) => {
    const requests = await ContactRequest.findAll({
      include: [
        {
          model: Student,
          as: "student",
          attributes: ['id','name'],
        },
        {
          model: Student,
          as: "requested_user",
          attributes: ['id','name'],
        },
      ],
      attributes: { exclude: ["requestBy", "requestedTo"] },
    });
    if (requests.length > 0) {
      res.status(200).json(requests)
    } else {
      res.status(400).json({
        message: 'No Request Found'
      })
    }
  },
  editContactRequest: async (req, res) => {
    const result = await ContactRequest.update(req.body, {
      where: {id: req.params.id}
    });
    if(result[0]>0){
      res.status(200).json({
        message: 'Permission Changed Successfully'
      })
    }else{
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }
};
