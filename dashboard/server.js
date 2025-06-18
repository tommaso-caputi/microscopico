// arduino-server.js
const { SerialPort } = require('serialport');
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const port = new SerialPort({
    path: '/dev/cu.usbmodem11201',
    baudRate: 9600,
});

// Buffer per costruire linee complete
let buffer = '';

port.on('data', (data) => {
    buffer += data.toString();

    if (buffer.includes('\n')) {
        const lines = buffer.split('\n');
        buffer = lines.pop(); // salva eventuali dati incompleti

        lines.forEach((line) => {
            try {
                const jsonData = JSON.parse(line.trim());
                console.log('JSON da Arduino:', jsonData);
                io.emit('arduino-json', jsonData);
            } catch (err) {
                console.warn('Dati non validi:', line);
            }
        });
    }
});

server.listen(3001, () => {
    console.log('Arduino server in ascolto su http://localhost:3001');
});
