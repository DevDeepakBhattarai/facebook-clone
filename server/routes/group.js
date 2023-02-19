const express = require("express");
require("dotenv").config();
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
});

router.get("/", (req, res) => {
  let sql = `select t1.group_id,group_name,profile_pic from messenger_group as t1 join(
            select t3.group_id,messenger_group,user_id from user_data as t2
            Join json_table(
                t2.messenger_group,
            "$[*]" columns(group_id int path "$.group_id")
            ) as t3
            WHere t2.user_id=1
            ) as result
            ON result.group_id =t1.group_id;`;
  db.query(sql, (err, result, field) => {
    res.send(result.length > 0 ? result : { status: 400 });
  });
});
module.exports = router;
