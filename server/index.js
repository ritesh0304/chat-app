import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import { userRoute } from './routes/user.route.js';
import { messageRoute } from './routes/messages.route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config({
    path: './.env'
});

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
    origin: '*', // Adjust to your frontend origin
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', userRoute);
app.use('/api/message', messageRoute);

// Connect to the database
connectDB().then(() => {
    // Start the HTTP server
    server.listen(process.env.PORT, () => {
        console.log("Server is working at PORT:", process.env.PORT);
    });
});

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

// Map to store online users and their socket IDs
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle adding user to online users map
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} connected with socket id ${socket.id}`);
    });

    // Handle sending messages
    socket.on("send-msg", (data) => {
        console.log("Received message data:", data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            console.log(`Sending message to user ${data.to} with socket id ${sendUserSocket}`);
            io.to(sendUserSocket).emit("msg-recieve", data);
        } else {
            console.log(`User ${data.to} is not online or socket not found.`);
            // Handle the case where the recipient is not online or socket ID is not found
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} removed from online users`);
                break;
            }
        }
    });
});
