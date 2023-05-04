const db = require("../model");
const { Op } = require('sequelize');

const Student = db.student;
const Chat = db.chat;

module.exports = {
    getAllStudent: async (req, res) => {
        const { id } = req.user;
        const students = await Student.findAll({
            where: {
                id: { [Op.ne]: id }
            },
            attributes: ['id', 'name', 'email', 'photo', 'gender']
        })
        res.status(200).json(students)
    },
    sendMessege: (req, res) => {
        const { id } = req.user;
        const { receiver } = req.query;
        Chat.create({
            sender: id,
            receiver,
            message: req.body.message
        }).then(result => {
            res.status(200).json({
                message: 'message sent'
            })
        }).catch(err => {
            console.log(err)
            res.status(400).json({
                message: "server error occurd",
            })
        })
    },
    getAllMessage: async (req, res) => {
        const sender = req.user.id;
        const { receiver } = req.query;
        const result = await Chat.findAll({
            where: {
                [Op.and]: [
                    { receiver: { [Op.or]: [sender, receiver] } },
                    { sender: { [Op.or]: [sender, receiver] } },
                ]
            },
            order:['createdAt']
        });
        const porjected = result.map(message => {
            return {
                fromSelf: message.sender === sender,
                msg: message.message
            }
        })
        res.status(200).json(porjected)
    }
};