const express = require("express");
require("dotenv").config();
const cors = require('cors')
const { connection } = require("./config/db")
const { userRoute } = require("./config/routes/userroute")
const app = express();

app.use(express.json());
app.use(cors())


// <----------------  Socket.io   ---------------->

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);


io.on("connection", (socket) => {
    socket.on("joinroom", (data) => {

    })
})



//----------------  Socket.io end   ---------------->

app.use("/user", userRoute);

server.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("successfully connected to database");
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Server is runnning on Port ${process.env.PORT}`);
})