// Import required modules
const { SerialPort } = require('serialport');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

// Initialize Express app and HTTP server
const app = express();
app.use(cors()); // Enable CORS for all requests
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
}); // Set up socket.io with CORS

// Set up the serial port connection to Arduino
const port = new SerialPort({
    path: '/dev/cu.usbmodem11201', // Update this path as needed for your Arduino
    baudRate: 9600, // Baud rate must match Arduino's serial settings
});

let buffer = '';
let latestData = null; // Store the latest valid Arduino data

// Listen for incoming data from the Arduino
port.on('data', (data) => {
    buffer += data.toString(); // Append incoming data to buffer
    if (buffer.includes('\n')) { // Check for newline (end of message)
        const lines = buffer.split('\n'); // Split buffer into lines
        buffer = lines.pop(); // Keep any incomplete line in buffer
        lines.forEach((line) => {
            try {
                const jsonData = JSON.parse(line.trim()); // Parse JSON data from Arduino
                latestData = jsonData; // Update latest data
            } catch (err) {
            }
        });
    }
});

// Emit latestData to all connected clients at a regular interval
setInterval(() => {
    if (latestData) {
        io.emit('arduino-data', latestData);
    }
}, 1000); // Emit every X ms

// HTTP endpoint to get the latest Arduino data
app.get('/api/arduino-data', (req, res) => {
    if (latestData) {
        res.json(latestData); // Send latest data as JSON
    } else {
        res.status(204).send(); // No Content if no data yet
    }
});

// Start the HTTP server
server.listen(3001, () => {
    console.log('Arduino server listening at http://localhost:3001');
});
