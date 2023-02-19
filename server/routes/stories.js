const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { v4: uuid } = require("uuid");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");
const cron = require("node-cron");
const rimraf = require("rimraf");

const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./stories");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

fs.watch("./stories", (eventType, filename) => {
  if (eventType === "rename" && fs.existsSync(`./stories/${filename}`)) {
    setTimeout(() => {
      rimraf.sync(`./stories/${filename}`);
      console.log("File deleted");
    }, 86400000);
  }
});

router.post("/getStory", async (req, res) => {
  const { user } = req.body;
  if (typeof user === "number") {
    return res.send("Mf give me the real user Id");
  }
  const Stories = [];

  db.query("SELECT * FROM stories WHERE user_id =?", [user], (err, res) => {
    if (err) {
      console.log(err);
    }
    Stories.push({
      user_id: user,
      stories: [...res],
    });
  });

  const friends = await new Promise((resolve, reject) => {
    db.query(
      "Select friend from friends where user_id =?",
      [user],
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res[0].friend ? res[0].friend : []);
      }
    );
  });

  await Promise.all(
    friends.map(async ({ friend }) => {
      const story = await new Promise((resolve, reject) => {
        db.query(
          `SELECT user_data.first_name, user_data.last_name, user_data.user_id, user_data.profile_pic,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'story_id', stories.story_id,
              'story_type', stories.story_type,
              'options', stories.options,
              'seen',JSON_CONTAINS(stories.seen_by,?,"$"),
              'uploaded_time',stories.uploaded_time
            )
          ) AS stories
        FROM user_data
        JOIN stories ON user_data.user_id = stories.user_id
        where stories.user_id=?;`,
          [String(user), friend],

          (err, res) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(res[0].stories ? res[0] : null);
          }
        );
      });
      if (story) Stories.push(story);
    })
  );

  res.send(Stories);
});

router.post("/textStory", (req, res) => {
  const { background, caption, font, user } = req.body;
  let currentTime = new Date();
  const story_id = crypto.randomUUID();
  let nextTime = new Date(currentTime);
  nextTime.setHours(currentTime.getHours() + 24);
  console.log(nextTime.getHours());
  let SQL =
    'insert into stories(user_id,story_id,story_type,uploaded_time,options) values(?,?,"text",?,?)';
  db.query(
    SQL,
    [
      user,
      story_id,
      Math.floor(Date.now() / 1000),
      JSON.stringify({ caption, font, background }),
    ],
    (err) => {
      if (err) console.log(err);
    }
  );

  var task = cron.schedule(
    `${nextTime.getMinutes()} ${nextTime.getHours()} ${nextTime.getDate()} ${
      nextTime.getMonth() + 1
    } *`,
    function () {
      db.query("delete from stories where story_id=?", [story_id], (err) => {
        console.log("Story deleted");
        if (err) console.log(err);
        task.stop();
      });
    },
    { scheduled: true }
  );

  res.send("Story successfully Uploaded");
});

router.post("/photoStory", upload.single("stories"), (req, res) => {
  console.log("Yo");
  const UniqueName = Date.now() + Math.round(Math.random() * 10000);
  const { stories, user } = req.body;
  const insertingSql = `Insert into stories(user_id,story_id,story_type,uploaded_time,photo) values(?,?,'photo',${Date.now()},'http://192.168.1.75:3001/stories/${UniqueName}.png')`;
  db.query(insertingSql, [user, crypto.randomUUID()], (err) => {
    if (err) console.log(err);
  });

  fs.writeFile(`stories/${UniqueName}.png`, stories, "base64", function (err) {
    if (err) return res.status(500).send(err);
    res.send({
      message: "Image uploaded successfully",
    });
  });
});

module.exports = router;
