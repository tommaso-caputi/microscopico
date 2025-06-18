const { SerialPort } = require('serialport');
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const USE_RANDOM_DATA = true; // Set to false to use real serial data

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Emit random data every second for debugging
setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const jsonData = {
        temp: parseFloat((20 + Math.random() * 10).toFixed(1)), // temperature (20-30 range)
        hum: parseFloat((40 + Math.random() * 20).toFixed(1)),  // humidity (40-60 range)
        rtc: timeString, // time string (HH:MM:SS format)
        rain: Math.random() > 0.7 ? 1 : 0, // rain presence (0 or 1)
        soil: Math.floor(Math.random() * 101), // soil moisture (0-100 range)
        movement: Math.random() > 0.8 ? 1 : 0 // movement/fall detection (0 or 1)
    };
    console.log('JSON random:', jsonData);
    io.emit('arduino-json', jsonData);
}, 10000);

server.listen(3001, () => {
    console.log('Arduino server in ascolto su http://localhost:3001');
});
