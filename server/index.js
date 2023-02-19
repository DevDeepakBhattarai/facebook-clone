const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const storageRouter = require("./routes/storage");
const { callRouter, callStart } = require("./routes/call");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const { chatRouter, chatStart } = require("./routes/chat");
const groupRouter = require("./routes/group");
const friendsRouter = require("./routes/friends");
const profileRouter = require("./routes/profile");
const storiesRoute = require("./routes/stories");
const requestRouter = require("./routes/request");
const { Server } = require("socket.io");
const postsRouter = require("./routes/posts");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://192.168.1.75:3000", "http://localhost:3000"],
    optionsSuccessStatus: 200,
  })
);

const server = http.createServer(app);
server.timeout = 30000;

const io = new Server(server, {
  cors: {
    origin: ["http://192.168.1.75:3000", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});
io.on("connection", (socket) => {
  socket.emit("id", socket.id);
  console.log(`User connected: ${socket.id}`);

  socket.broadcast.emit("userConnected", {
    socketId: socket.id,
    facebookId: socket.handshake.headers.id,
  });
});

chatStart(io);
callStart(io);

app.use("/chatImages", express.static("chatImages"));
app.use("/stories", express.static("stories"));
app.use("/posts", express.static("posts"));
app.use("/profile", express.static("profile"));
app.use(storageRouter);
app.use("/login", loginRouter);
app.use("/register/", registerRouter);
app.use("/groups", groupRouter);
app.use("/friends/", friendsRouter);
app.use("/request/", requestRouter);
app.use("/profile/", profileRouter);
app.use(chatRouter);
app.use(callRouter);
app.use(postsRouter);
app.use(storiesRoute);
server.listen(3001, "192.168.1.75");
