const express = require("express");
require("dotenv").config();
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const link = require("link-preview-generator");
let Socket;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./chatImages");
  },
  filename: (req, file, cb) => {
    let fileName =
      Date.now() + Math.floor(Math.random() * 100000) + file.originalname;
    imageToBeStoredInDB = fileName;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

let socket;

const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
  connectTimeout: 30000,
});

router.post("/message", (req, res) => {
  let roomName = req.body.roomName;
  db.query(
    "select * from messages where roomId=?",
    [roomName],
    (err, result) => {
      if (err) console.log(err);
      if (result.length > 0) {
        res.send(result[0].messages);
      }
    }
  );
});
const httpLinkRegex =
  /(http(s)?:\/\/(www\.)?)[a-zA-Z0-9!_\_$]+(\.[a-zA-Z]{2,5})/;
const wwwLinkRegex = /(www\.)[a-zA-Z0-9!_\_$]+(\.[a-zA-Z]{3,4})/;

router.post("/chatImages", upload.array("chatImages", 30), (req, res) => {
  let pathOfImages = req.files.map((element) => {
    return `http://192.168.1.75:3001/chatImages/${element.filename}`;
  });

  Socket.to(req.body.roomName).emit(pathOfImages);

  let receivedMessage = {
    message: pathOfImages,
    sender: Number(req.body.sender),
    seen: false,
    id: req.body.id,
    type: "images",
  };

  db.query(
    "select * from messages where roomId=?",
    [req.body.roomName],
    (err, result) => {
      if (err) console.log(err);
      let queriedMessage = result[0].messages;
      let insertingMessages = [...queriedMessage, receivedMessage];

      db.query(
        "update messages set messages= ? where roomId=?",
        [JSON.stringify(insertingMessages), req.body.roomName],
        (err) => {
          if (err) console.log(err);
        }
      );
    }
  );
  res.sendStatus(200);
});

module.exports = {
  chatRouter: router,

  chatStart: function (io) {
    io.on("connection", (socket) => {
      Socket = socket;
      socket.on("join room", (data) => {
        socket.join(data.roomName);
        db.query(
          `select * from messages where roomId=${data.roomName}`,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            if (!result.length > 0) {
              db.query("insert into messages(roomID,messages) values(?,?)", [
                data.roomName,
                JSON.stringify([]),
              ]);
            }
          }
        );
      });

      socket.on("seenChat", async (data) => {
        db.query(
          `select * from messages where roomId=?`,
          [data.roomName],
          (err, result) => {
            if (err) return console.log(err);
            result[0].messages.forEach((element) => {
              if (element.sender !== data.userId) {
                element.seen = true;
              }
            });

            db.query(
              `update messages set messages=? where roomId=?`,
              [JSON.stringify(result[0].messages), data.roomName],
              (err) => {
                if (err) return console.log(err);

                socket.to(data.roomName).emit("ChatUpdate");
              }
            );
          }
        );
      });
      socket.on("message", async (data) => {
        let id = uuid();
        if (httpLinkRegex.test(data.sendingMessage)) {
          let preview = await link(httpLinkRegex.exec(data.sendingMessage)[0]);
          console.log(preview);
          socket.to(data.message).emit("receive message", [
            {
              message: { ...preview, message: data.sendingMessage },
              sender: data.sender,
              seen: false,
              id: id,
              type: "link",
            },
          ]);

          socket.emit("ChatUpdate");
          db.query(
            "select * from messages where roomId=?",
            [data.roomName],
            (err, result) => {
              if (err) console.log(err);
              let queriedMessage = result[0].messages || [];
              let receivedMessage = {
                message: { ...preview, message: data.sendingMessage },
                sender: data.sender,
                seen: false,
                id: id,
                type: "link",
              };
              let insertingMessages = [...queriedMessage, receivedMessage];

              db.query(
                "update messages set messages= ? where roomId=?",
                [JSON.stringify(insertingMessages), data.roomName],
                (err) => {
                  if (err) console.log(err);
                }
              );
            }
          );

          return;
        } else if (wwwLinkRegex.test(data.sendingMessage)) {
          let receivedLink = `http://${
            wwwLinkRegex.exec(data.sendingMessage)[0]
          }`;
          let preview = await link(receivedLink);
          console.log(preview);

          socket.to(data.roomName).emit("receive message", [
            {
              message: {
                ...preview,
                message: data.sendingMessage,
                url: receivedLink,
              },
              sender: data.sender,
              id: id,
              type: "link",
              seen: false,
            },
          ]);
          socket.emit("ChatUpdate");

          db.query(
            "select * from messages where roomId=?",
            [data.roomName],
            (err, result) => {
              if (err) console.log(err);
              let queriedMessage = result[0].messages;
              let receivedMessage = {
                message: { ...preview, message: data.sendingMessage },
                sender: data.sender,
                seen: false,
                id: id,
                type: "link",
              };
              let insertingMessages = [...queriedMessage, receivedMessage];

              db.query(
                "update messages set messages= ? where roomId=?",
                [JSON.stringify(insertingMessages), data.roomName],
                (err) => {
                  if (err) console.log(err);
                }
              );
            }
          );
          return;
        } else {
          socket.to(data.roomName).emit("receive message", [
            {
              message: data.sendingMessage,
              sender: data.sender,
              seen: false,
              id: id,
            },
          ]);

          let receivedMessage = {
            message: data.sendingMessage,
            sender: data.sender,
            seen: false,
            id: id,
          };
          db.query(
            "select * from messages where roomId=?",
            [data.roomName],
            (err, result) => {
              if (err) console.log(err);
              let queriedMessage = result[0].messages;
              let insertingMessages = [...queriedMessage, receivedMessage];

              db.query(
                "update messages set messages= ? where roomId=?",
                [JSON.stringify(insertingMessages), data.roomName],
                (err) => {
                  if (err) console.log(err);
                }
              );
            }
          );
          console.log("Data sent");
        }
      });

      socket.on("disconnect", () => {
        console.log(`DISCONNECTED ${socket.id}`);
      });
    });
  },
};
