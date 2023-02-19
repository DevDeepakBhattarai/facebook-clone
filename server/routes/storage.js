const express = require("express");
require("dotenv").config();
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

router.use("/images", express.static("images"));

router.post("/images", upload.single("avatar"), (req, res) => {
  res.sendStatus(200);
});
module.exports = router;
