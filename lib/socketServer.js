const socketIO = require('socket.io');

function startSocketServer(httpServer) {
    const io = socketIO(httpServer);

    io.on('connection', (socket) => {
        console.log('A user has connected');

        socket.on('disconnect', () => {
            console.log('A user has disconnected');
        });

        socket.on('message', (data) => {
            console.log('Received message:', data);
            socket.broadcast.emit('message', data);
        });
    });
}

module.exports = startSocketServer;