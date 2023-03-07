const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");

const db = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  database: "facebook",
  password: process.env.DB_PASS,
  connectTimeout: 30000,
});

const sessionStore = new MySQLStore({
  host: process.env.HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.DB_PASS,
  database: "facebook",
});

router.use(cookieParser());
router.use(
  session({
    secret: "cookie",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 1000 * 24 * 60 * 60 * 2,
    },
  })
);

router.post("/", (req, res) => {
  res.clearCookie("token");
  if (req.session?.isAuth) {
    db.query(
      "Select * from user_data where user_id=?",
      [req.session.user_id],
      (err, result) => {
        if (err) console.log(err);
        else {
          res.send({
            isAuth: true,
            userId: result[0].user_id,
            userName: `${result[0].first_name} ${result[0].last_name}`,
            profile: result[0].profile_pic,
          });
        }
      }
    );
  } else {
    let email = req.body.email;
    let password = req.body.password;
    db.query(
      "select first_name,last_name,user_id,email,password,profile_pic from user_data where email=?",
      [email],
      async (err, result) => {
        if (err) return console.log(err);
        if (result.length > 0) {
          if (await bcrypt.compare(`${password}`, `${result[0].password}`)) {
            req.session.isAuth = true;
            req.session.user_id = result[0].user_id;
            req.session.save();

            res.send({
              isAuth: true,
              userId: result[0].user_id,
              userName: `${result[0].first_name} ${result[0].last_name}`,
              profile: result[0].profile_pic,
            });
          } else {
            res.send({
              isAuth: false,
              message: "Password incorrect",
            });
          }
        } else {
          res.send({
            isAuth: false,
            message: "User not found",
          });
        }
      }
    );
  }
});

module.exports = router;
