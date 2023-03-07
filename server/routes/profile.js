const e = require("express");
const express = require("express");
require("dotenv").config();
const router = express.Router();
const mysql = require("mysql2");
const formidable = require("formidable");
const sharp = require("sharp");

const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
  connectTimeout: 30000,
});

router.post("/getData", (req, res) => {
  const { user } = req.body;
  console.log(user);
  const SQL_FOR_GETTING_USERDATA = "select * from user_data where user_id =?";
  db.query(SQL_FOR_GETTING_USERDATA, [user], async (err, result) => {
    if (err) return console.log(err);
    try {
      let date = new Date(result[0].date_of_birth);
      let formattedDate = date.toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const SQL_FOR_GETTING_FRIENDS =
        "SELECT friend from friends where user_id=?";

      let noOfFriends = await new Promise((resolve, reject) => {
        db.query(SQL_FOR_GETTING_FRIENDS, [user], (err, data) => {
          if (err) {
            reject(err);
            console.log(err);
          }

          resolve(data[0].friend.length);
        });
      });

      const newDataToSend = {
        userName: `${result[0].first_name} ${result[0].last_name}`,
        dateOfBirth: formattedDate,
        noOfFriends,
        profilePicture: result[0].profile_pic,
      };
      res.send(newDataToSend);
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  });
});

const UPDATE_PROFILE = "update user_data set profile_pic=? where user_id=?";

router.post("/upload-profile", formDataMiddleware, (req, res) => {
  const files = req.files;
  const { user, caption } = req.body;
  console.log(files);
  // res.send("Done");
  const nameOfProfilePic = files.profile.newFilename + Date.now() + ".jpg";
  const pathOfProfilePic = `http://192.168.1.75:3001/profile/${nameOfProfilePic}`;

  db.query(UPDATE_PROFILE, [pathOfProfilePic, user], (err) => {
    if (err) console.log(err);
  });

  sharp(files.profile.filepath)
    .toFile(`./profile/${nameOfProfilePic}`)
    .then(() => {
      res.send("Done");
    });
});

function formDataMiddleware(req, res, next) {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    req.body = fields;
    req.files = files;
    next();
  });
}

module.exports = router;
