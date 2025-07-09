const socketIo = require('socket.io');

function initializeSocket(server) {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Handle route selection
        socket.on('selectRoute', (data) => {
            console.log('Route selected:', data.routeId);
        });

        // Handle location updates
        socket.on('send-location', (data) => {
            socket.broadcast.emit('receive-location', {
                id: socket.id,
                latitude: data.latitude,
                longitude: data.longitude
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            io.emit('user-disconnected', socket.id);
        });
    });

    return io;
}

module.exports = initializeSocket; 