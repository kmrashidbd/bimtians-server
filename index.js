const express = require('express');
const cors = require('cors');
// const startSocketServer = require('./lib/socketServer');
const socket = require('socket.io');
const http = require('http');
require('dotenv').config();

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

//socket listening
const httpServer = http.createServer(app);
//end of socket listening

app.use('/assets/', express.static('assets'));

//external route
app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/student', require('./routes/studentRoute'));
app.use('/api/v1/external', require('./routes/externalRoute'));
app.use('/api/v1/chat', require('./routes/chatRoute'));

app.get('/', (req, res) => {
    res.send('Marine Student Database Is Running Successfully')
});

const server = app.listen(port, () => {
    console.log(`server is running at port ${port}`)
});

const io = socket(server,{
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

global.onlineUsers = new Map();

let activeUsers = [];

io.on('connection', (socket) => {
    console.log('A user has connected');
    global.chatSocket = socket;

    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id)
        if(!activeUsers.some(user=>user.userId === userId)){
            activeUsers.push({
                userId,
                socketId: socket.id
            })
        }
        io.emit('get-users', activeUsers)
    })

    socket.on('send-message',(data)=>{
        const sendUserSocket = onlineUsers.get(data.receiver);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-receive', data.msg)
        }
    })

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user=>user.socketId !== socket.id);
        console.log('A user has disconnected', activeUsers);
        io.emit('get-users', activeUsers)
    });

    socket.on('message', (data) => {
        console.log('Received message:', data);
        socket.broadcast.emit('message', data);
    });
});