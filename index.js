const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./model');

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:3000',
        "http://bimtian.org",
        "https://bimtian.org",
    ],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET,PUT,POST,DELETE,UPDATE,OPTIONS'],
    exposedHeaders: ['set-cookie'],
}));


app.use('/assets/', express.static('assets'));

//external route
app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/student', require('./routes/studentRoute'));
app.use('/api/v1/external', require('./routes/externalRoute'));
app.use('/api/v1/chat', require('./routes/chatRoute'));
app.use('/api/v1/job', require('./routes/jobRoute'));

app.get('/', (req, res) => {
    res.send('Marine Student Database Is Running Successfully')
});

const server = app.listen(port, () => {
    console.log(`server is running at port ${port}`)
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: [
            'http://localhost:3000',
            "http://bimtian.org",
            "https://bimtian.org",
        ],
    }
});

global.onlineUsers = new Map();

let activeUsers = [];

io.on("connection", (socket) => {
    console.log('connected to socket.io');
    global.chatSocket = socket;
    //connect loggedin user
    socket.on('setup', (userData) => {
        onlineUsers.set(userData.id, socket.id)
        socket.join(userData.id);
        if(!activeUsers.some(user=>user.userId === userData.id)){
            activeUsers.push({
                userId: userData.id,
                socketId: socket.id
            })
        }
        socket.emit('connected', activeUsers);
    });

    socket.on('join chat', (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', async (newMessageRecieved) => {
        // console.log(newMessageRecieved)
        const chatUsers = [];
        let chat = newMessageRecieved.chat;
        const data = await db.chat.findOne({
            where:{id: chat}
        })
        if(data.isGroupChat){
            const groupUsers = await db.chat_user.findAll({
                where: {
                    chat: data.id
                }
            })
            groupUsers.forEach(user => {
                chatUsers.push(user.user)
            });
        }else{
            chatUsers.push(data.senderId, data.receiverId)
        }

        chatUsers.forEach(async (user) => {
            if (user === newMessageRecieved.senderId) return;
            socket.in(user).emit("message recieved", newMessageRecieved);
        })
    });

    socket.off("setup", (userData)=>{
        activeUsers = activeUsers.filter(user=>user.socketId !== socket.id);
        socket.emit('connected', activeUsers);
        socket.leave(userData.id)
        console.log("user disconnected");
    })
})