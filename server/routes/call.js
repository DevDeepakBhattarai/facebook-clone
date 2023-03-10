const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const mysql = require("mysql2");
const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
  connectTimeout: 30000,
});

module.exports = {
  callRouter: router,
  callStart: function (io) {
    io.on("connection", function (socket) {
      socket.on("joinCallRoom", (data) => {
        socket.join(data.roomName);
      });

      socket.on("callUser", (data) => {
        db.query(
          "select profile_pic, first_name,last_name from user_data where user_id =?",
          [data.from],
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            socket.to(data.userToCall).emit("beingCalled", {
              userName: `${result[0].first_name} ${result[0].last_name}`,
              profile: result[0].profile_pic,
              offer: data.offer,
              roomName: data.roomName,
              negotiationneeded: data.negotiationneeded,
            });
          }
        );
      });

      socket.on("callAccepted", (data) => {
        socket.to(data.roomName).emit("callAccepted", { answer: data.answer });
      });

      socket.on("acceptCall", (data) => {
        socket.to(data.to).emit("callAccepted", data.signal);
      });

      socket.on("negotiationNeeded", (data) => {
        socket.to(data.roomName).emit("negotiationNeeded", {
          offer: data.offer,
          roomName: data.roomName,
        });
      });

      socket.on("iceCandidate", (data) => {
        socket
          .to(data.roomName)
          .emit("iceCandidate", { candidate: data.candidate });
      });

      socket.on("callEnded", (data) => {
        console.log(data.roomName);
        socket.to(data.roomName).emit("callEnded", {});
      });
    });
  },
};
