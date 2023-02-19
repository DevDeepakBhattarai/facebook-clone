require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const nodeMailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

let nodeMailerTransporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const db = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  database: "facebook",
  password: process.env.DB_PASS,
});
router.use(cookieParser());

router.post("/", async (req, res) => {
  const { secondEmail } = req.body;
  db.query(
    "Select * from user_data where email=?",
    [secondEmail],
    async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length >= 1) {
        return res.send("Email is already taken Please enter a unique email");
      } else {
        let OTP = Math.floor(100000 + Math.random() * 900000);
        console.log(OTP);
        let hashedOTP = await bcrypt.hash(`${OTP}`, 10);
        let data = { ...req.body, hashedOTP: hashedOTP, iat: Date.now() };

        let accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "6h",
        });
        res.cookie("token", accessToken, { maxAge: 60 * 60 * 1000 });

        let message = {
          from: `"Deepak's Facebook Clone" <pokemongamingworld123@gmail.com>`,
          to: req.body.secondEmail,
          subject: "Verification OTP",
          html: `<h1> Your Verification OTP is ${OTP}</h1>
        <p>Do not share this to anyone</p>`,
        };
        await nodeMailerTransporter.sendMail(message, (err, info) => {
          if (err) {
            console.log("Error occurred. " + err.message);
            res.sendStatus(500);
            return process.exit(1);
          }
          console.log("Message sent: %s", info.messageId);
          res.send({
            otpLength: OTP.toString().length,
            message: "Email sent",
          });
        });
      }
    }
  );
});

router.post("/verify", (req, res) => {
  console.log(req.cookies);
  let OTP = req.body.otp;
  jwt.verify(
    req.cookies.token,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, data) => {
      if (error) {
        res.send(
          "You have changed the token Please send the token without altering it"
        );
        return process.exit(1);
      }

      console.log(data);
      let match = await bcrypt.compare(`${OTP}`, `${data.hashedOTP}`);

      if (match && Date.now() < data.iat + 86400000) {
        let sql =
          "INSERT INTO user_data(first_name,last_name,email,password,date_of_birth,gender,genderPronoun,optionalGender,age) VALUES(?,?,?,?,?,?,?,?,?)";
        let {
          firstName,
          lastName,
          secondEmail,
          password,
          dateOfBirth,
          gender,
          genderPronoun,
          optionalGender,
          age,
        } = data;
        password = await bcrypt.hash(`${password}`, 10);
        db.query(
          sql,
          [
            firstName,
            lastName,
            secondEmail,
            password,
            dateOfBirth,
            gender,
            genderPronoun,
            optionalGender,
            age,
          ],
          (Error) => {
            if (Error) {
              console.log(Error);
            }
          }
        );
        res.clearCookie("token");
        res.send({
          status: 200,
          message: "Account Created",
        });
      } else {
        res.send({
          status: 400,
          message:
            "The OTP you have entered is incorrect. Pease enter the correct one and try again",
        });
      }
    }
  );
});

router.post("/resend", async (req, res) => {
  let token = req.cookies.token;
  let OTP = Math.floor(100000 + Math.random() * 900000);
  console.log(OTP);
  let hashedOTP = await bcrypt.hash(`${OTP}`, 10);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
    if (err) {
      console.log(err);
    }

    let message = {
      from: `"Deepak's Facebook Clone" <pokemongamingworld123@gmail.com>`,
      to: data.secondEmail,
      subject: "Verification OTP",
      html: `<h1> Your Verification OTP is ${OTP}</h1>
      <p>Do not share this to anyone</p>`,
    };

    nodeMailerTransporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        res.sendStatus(500);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
    });

    let newData = { ...data, hashedOTP: hashedOTP };
    console.log(newData);
    let newToken = await jwt.sign(newData, process.env.ACCESS_TOKEN_SECRET);
    res.clearCookie("token");

    res.cookie("token", newToken, { maxAge: 60 * 60 * 1000 });

    res.send("Resent");
  });
});

module.exports = router;
