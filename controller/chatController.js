const db = require("../model");
const { Op } = require("sequelize");

const Student = db.student;
const Chat = db.chat;
const GroupUser = db.chat_user;
const Message = db.message;
const Notification = db.notification;

async function getGroupMessage(data) {
  const newData = data.map(
    async (groupChat) =>
      await Chat.findOne({
        where: { id: groupChat.chat },
      })
  );
  return newData;
}

module.exports = {
  accessChat: async (req, res) => {
    const sender = req.user.id;
    const { receiver } = req.query;
    if (!receiver || receiver === "undefined") {
      return res.status(400).json({
        message: "Chat Id Not send with req",
      });
    }
    let isChat = await Chat.findOne({
      where: {
        isGroupChat: false,
        [Op.and]: [
          { receiverId: { [Op.or]: [sender, receiver] } },
          { senderId: { [Op.or]: [sender, receiver] } },
        ],
      },
      include: [
        {
          model: Student,
          as: "receiver",
          foreignKey: {
            name: "receiverId",
          },
          attributes: ["id", "name", "photo", "email"],
        },
        {
          model: Student,
          as: "sender",
          foreignKey: {
            name: "senderId",
          },
          attributes: ["name", "photo", "email"],
        },
        {
          model: Message,
          as: "latest_message",
          foreignKey: {
            name: "latestMessageId",
          },
          attributes: ["message"],
        },
        {
          model: Message,
          as: "messages",
          foreignKey: {
            name: "chat",
          },
          attributes: ["message", "createdAt", "updatedAt"],
        },
      ],
      attributes: ["id", "latestMessageId"],
    });
    if (!isChat) {
      const newChat = {
        isGroupChat: false,
        senderId: sender,
        receiverId: receiver,
      };
      const chat = await Chat.create(newChat);
      const fullChat = await Chat.findOne({
        where: { id: chat.id },
        include: [
          {
            model: Student,
            as: "receiver",
            foreignKey: {
              name: "receiverId",
            },
            attributes: ["id", "name", "photo", "email"],
          },
          {
            model: Student,
            as: "sender",
            foreignKey: {
              name: "senderId",
            },
            attributes: ["name", "photo", "email"],
          },
          {
            model: Message,
            as: "latest_message",
            foreignKey: {
              name: "latestMessageId",
            },
            attributes: ["message", "senderId"],
          },
          {
            model: Message,
            as: "messages",
            foreignKey: {
              name: "chat",
            },
            attributes: ["message", "createdAt", "updatedAt"],
          },
        ],
        attributes: ["id", "latestMessageId"],
      });
      res.status(400).json(fullChat);
    } else {
      res.status(200).json({
        chat: isChat,
      });
    }
  },
  getChatById: async (req, res) => {
    const id = req.query.id;
    try {
      const chat = await Chat.findOne({
        where: { id: id },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
    }
  },
  fetchChatByUserId: async (req, res) => {
    try {
      let newGroupChat = [];
      const groupChatId = await GroupUser.findAll({
        where: {
          user: req.user.id,
        },
        include: [
          {
            model: Chat,
            as: "group_chat",
            include: [
              {
                model: Message,
                as: "latest_message",
                foreignKey: {
                  name: "latestMessageId",
                },
                attributes: ["message", "senderId"],
              },
              {
                model: Message,
                as: "messages",
                foreignKey: {
                  name: "chat",
                },
                attributes: ["message", "createdAt", "updatedAt"],
              },
            ],
          },
        ],
        attributes: {
          exclude: ["id", "user", "chat", "createdAt", "updatedAt"],
        },
      });
      groupChatId.forEach((newChat) => newGroupChat.push(newChat.group_chat));
      const chat = await Chat.findAll({
        where: {
          [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
        include: [
          {
            model: Student,
            as: "receiver",
            foreignKey: {
              name: "receiverId",
            },
            attributes: ["id", "name", "photo", "email"],
          },
          {
            model: Student,
            as: "sender",
            foreignKey: {
              name: "senderId",
            },
            attributes: ["name", "photo", "email"],
          },
          {
            model: Message,
            as: "latest_message",
            foreignKey: {
              name: "latestMessageId",
            },
            attributes: ["message", "senderId"],
          },
          {
            model: Message,
            as: "messages",
            foreignKey: {
              name: "chat",
            },
            attributes: ["message", "createdAt", "updatedAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: [
            "senderId",
            "receiverId",
            "groupName",
            "groupAdminId",
            "latestMessageId",
          ],
        },
      });
      const sendingChat = [...newGroupChat, ...chat];
      res.status(200).json(sendingChat);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
  createGroupChat: async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    try {
      const groupChat = await Chat.create({
        groupName: req.body.name,
        isGroupChat: true,
        groupAdminId: req.user.id,
      });
      const groupUsersId = [...users, req.user.id];
      groupUsersId.forEach((user) => {
        if (user === req.user.id) {
          GroupUser.create({
            user,
            chat: groupChat.id,
            isGroupAdmin: true,
          });
        } else {
          GroupUser.create({
            user,
            chat: groupChat.id,
            isGroupAdmin: false,
          });
        }
      });
      res.status(200).json({
        message: "Group Chat Create Successfull",
        name: groupChat.groupName,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  updateGroup: async (req, res) => {
    const { id } = req.query;
    try {
      const result = await Chat.update(
        { groupName: req.body.name },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(200).json({ message: "update successsfully" });
    } catch (err) {
      console.log(err);
    }
  },
  addGroupChatUser: async (req, res) => {
    GroupUser.create({
      user: req.body.user,
      chat: req.body.chatId,
    });
    res.status(200).json({ message: "user added successfull" });
  },
  removeGroupChatUser: async (req, res) => {
    const { id, chatId } = req.query;
    const result = await GroupUser.destroy({
      where: {
        chat: chatId,
        user: id,
      },
    });
    res.json({ message: "User Remove From Group Successfully" });
  },
  getAllStudent: async (req, res) => {
    const { id } = req.user;
    const students = await Student.findAll({
      where: {
        id: { [Op.ne]: id },
      },
      attributes: ["id", "name", "email", "photo", "gender"],
    });
    res.status(200).json(students);
  },
  getGroupChatUser: async (req, res) => {
    const chatUsers = await GroupUser.findAll({
      where: { chat: req.query.id },
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: { exclude: ["id", "chat", "createdAt", "updatedAt", "user"] },
    });
    res.status(200).json(chatUsers);
  },
  sendMessege: async (req, res) => {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
    const newMessage = {
      message,
      chat: chatId,
      senderId: req.user.id,
    };
    const data = await Message.create(newMessage);
    const newData = await Message.findOne({
      where: { id: data.id },
    });
    await Chat.update(
      { latestMessageId: data.id },
      {
        where: { id: chatId },
      }
    );
    res.status(200).json(data);
  },
  getAllMessage: async (req, res) => {
    const { chatId } = req.query;
    const result = await Message.findAll({
      where: {
        chat: chatId,
      },
      include: [
        {
          model: Student,
          as: "sender",
          attributes: ["name", "photo", "gender"],
        },
      ],
      order: ["createdAt"],
      attributes: { exclude: ["senderId"] },
    });
    res.status(200).json(result);
  },
  postNotification: async (req, res) => {
    const { chat, senderId, isGroupChat, sender, groupName } = req.body;
    const chatUsers = [];
    const data = await Chat.findOne({
      where: { id: chat },
    });
    if (data.isGroupChat) {
      const groupUsers = await GroupUser.findAll({
        where: {
          chat: data.id,
        },
      });
      groupUsers.forEach((user) => {
        chatUsers.push(user.user);
      });
    } else {
      chatUsers.push(data.senderId, data.receiverId);
    }
    chatUsers.forEach(async (user) => {
      const notification = await Notification.findAll({
        where: {
          chatId: chat,
          receiverId: user,
        },
      });
      if (user === senderId || notification.length>0) return;
      const newNotification = {
        isGroupChat,
        senderName: sender,
        receiverId: user,
        groupName,
        chatId: chat,
      };
      await Notification.create(newNotification);
    });
    res.json({ message: "working" });
  },
  getNotification: async (req, res) => {
    const id = req.query.id;
    const notifications = await Notification.findAll({
      where: { receiverId: id },
    });
    res.status(200).json(notifications);
  },
  deleteNotification: async (req, res) => {
    const { id } = req.query;
    await Notification.destroy({ where: { id: id } });
    res.status(200).json({ message: "Deleted Successfully" });
  },
  deleteGroup: async (req, res) => {
    const { id } = req.query;
    try {
      const result = await GroupUser.destroy({
        where: {
          chat: id,
        },
      });
      const result3 = await Chat.destroy({
        where: {
          id: id,
        },
      });
      const result2 = await Message.destroy({
        where: {
          chat: id,
        },
      });
      res.status(200).json({ message: "Deleted Successfull" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  },
};
