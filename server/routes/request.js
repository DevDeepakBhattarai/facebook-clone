const e = require("express");
const express = require("express");
require("dotenv").config();
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
  connectTimeout: 30000,
});

router.post("/", async (req, res) => {
  const { receiver, sender } = req.body;
  const SEARCHING_SQL = "select * from friend_request where user_id=?";
  const FRIEND_SEARCHING_SQL = "select friend from friends where user_id=?";
  const INSERTING_SQL_IF_USER_ALREADY_EXISTS =
    "update friend_request set requests=? where user_id=?";
  const INSERTING_SQL_IF_USER_DOES_NOT_EXIST =
    "insert into friend_request(user_id,requests) values(?,?)";
  let friend = [];

  await new Promise((resolve, reject) => {
    db.query(FRIEND_SEARCHING_SQL, [receiver], (err, results) => {
      if (err) {
        console.log(err);
        reject(new Error("Internal error"));
      } else {
        let friendList = results[0].friend;
        friend = friendList.filter((data) => data.friend === sender);
        resolve(friend?.length > 0 ? friend : []);
      }
    });
  });

  if (friend.length === 0) {
    db.query(SEARCHING_SQL, [receiver], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500);
      }
      let requestList = result[0]?.requests;
      let filteredList = requestList?.filter((data) => data.sender === sender);

      if (!filteredList?.length > 0) {
        if (result.length === 0) {
          const insertingData = JSON.stringify([
            {
              sender,
              date: Date.now(),
            },
          ]);
          db.query(
            INSERTING_SQL_IF_USER_DOES_NOT_EXIST,
            [receiver, insertingData],
            (err, result) => {
              if (err) {
                res.status(500);
                console.log(err);
              } else {
                res.send({ message: "Request Sent" });
              }
            }
          );
        } else if (result.length > 0) {
          const insertingData = JSON.stringify([
            ...result[0].requests,
            {
              sender,
              date: Date.now(),
            },
          ]);

          db.query(
            INSERTING_SQL_IF_USER_ALREADY_EXISTS,
            [insertingData, receiver],
            (err, result) => {
              if (err) {
                res.status(500);
                console.log(err);
              } else {
                res.send({ message: "Request Sent" });
              }
            }
          );
        }
      } else {
        res.send({ message: "Request Already Sent" });
      }
    });
  } else {
    res.send({ message: "The sender is already friend" });
  }
});

router.post("/getRequest", async (req, res) => {
  const { user } = req.body;
  const SEARCH_SQL = "select requests from friend_request where user_id=?";
  let mutualFriend;

  db.query(SEARCH_SQL, [user.toString()], async (err, results) => {
    if (err) {
      res.status(500);
      console.log(err);
    } else if (results.length === 0) {
      res.send({ message: "No results" });
    } else {
      let { requests } = results[0];
      let dataOfTheFriendRequestSender = [];
      let myFriends = [];

      await Promise.all(
        requests.map(async (data) => {
          let result;
          let noOfMutualFriends;
          let profilePicOfMutualFriends = [];
          try {
            result = await new Promise((resolve, reject) => {
              db.query(
                "select first_name,last_name,profile_pic from user_data where user_id=?",
                [data.sender],
                (err, results) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else {
                    resolve({
                      userName: `${results[0].first_name} ${results[0].last_name}`,
                      profile_pic: results[0].profile_pic,
                      date: data.date,
                    });
                  }
                }
              );
            });

            myFriends = await new Promise((resolve, reject) => {
              db.query(
                "SELECT friend from friends where user_id =?",
                [user],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(new Error("NOT Found"));
                  } else {
                    resolve(result[0] ? result[0].friend : []);
                  }
                }
              );
            });
            console.log(myFriends);

            noOfMutualFriends = await new Promise((resolve, reject) => {
              db.query(
                "SELECT friend from friends where user_id=?",
                [data.sender],
                async (err, result) => {
                  if (err) {
                    throw new Error("Not Found ");
                  } else {
                    if (myFriends?.length > 0) {
                      const user1Friends = new Set(
                        result[0]?.friend.map((friend) => friend.friend) || []
                      );
                      const user2Friends = new Set(
                        myFriends.map((friend) => friend.friend)
                      );
                      const commonFriends = [...user1Friends].filter((x) =>
                        user2Friends.has(x)
                      );
                      resolve(commonFriends);
                    } else {
                      resolve([]);
                    }
                  }
                }
              );
              //! end of mutual friend
            });

            await Promise.all(
              noOfMutualFriends.map(async (userId) => {
                const data = await new Promise((resolve, reject) => {
                  db.query(
                    "SELECT profile_pic from user_data where user_id =?",
                    [userId],
                    (err, result) => {
                      if (err) {
                        reject(new Error("Something went wrong"));
                        console.log(err);
                      } else {
                        resolve(result[0].profile_pic);
                      }
                    }
                  );
                });
                profilePicOfMutualFriends.push(data);
              })
            );

            result = {
              ...result,
              mutualFriend: noOfMutualFriends.length,
              mutualFriendProfilePic: profilePicOfMutualFriends,
              sender: data.sender,
            };
          } catch (err) {
            console.log(err);
          }
          dataOfTheFriendRequestSender.push(result);
        })
      );
      res.send(dataOfTheFriendRequestSender);
    }
  });
});

router.post("/accept", (req, res) => {
  const { user, sender } = req.body;
  console.log(user, sender);
  let newFriendListOfUser1 = [];
  let newFriendListOfUser2 = [];
  let sql = `select * from friends where user_id=? or user_id=?`;
  db.query(sql, [req.body.user, req.body.sender], (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      res.status(500).json("Something went wrong");
    }
    if (result.length === 2) {
      newFriendListOfUser1 = result[0].friend;

      newFriendListOfUser2 = result[1].friend;
    }
    if (result.length === 1) {
      newFriendListOfUser1 =
        result[0].user_id === sender ? [] : result[0].friend;
      newFriendListOfUser2 = result[0].user_id === user ? [] : result[0].friend;
    }

    newFriendListOfUser1.push({ date: new Date(), friend: req.body.sender });
    newFriendListOfUser2.push({ date: new Date(), friend: req.body.user });
    console.log(newFriendListOfUser1, newFriendListOfUser2);

    let updateSQL = `update friends set friend=? where user_id=?`;
    let INSERTING_SQL_IF_USER_DOES_NOT_EXIST =
      "insert into friends values(?, ?)";

    db.query(
      "select requests from friend_request where user_id = ?",
      [user],
      (err, result) => {
        console.log(result);
        if (err) {
          console.log(err);
        } else {
          let newRequest = result[0].requests.filter(
            (data) => data.sender !== sender
          );

          db.query(
            "update friend_request set requests = ? where user_id =? ",
            [JSON.stringify(newRequest), user],
            (err, result) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    );

    if (result[0]?.user_id === user || result[1]?.user_id === user) {
      db.query(
        updateSQL,
        [JSON.stringify(newFriendListOfUser1), req.body.user],
        (err) => {
          if (err) {
            console.log(err);
            res.status(500).json("Something went wrong");
          }
        }
      );
    }
    if (result[1]?.user_id === sender || result[0]?.user_id === sender) {
      db.query(
        updateSQL,
        [JSON.stringify(newFriendListOfUser2), req.body.sender],
        (err) => {
          if (err) {
            console.log(err);
            res.status(500).json("Something went wrong");
          }
          res.send("Successfully updated friend list");
        }
      );
    }
    if (result[0]?.user_id !== user && result[1]?.user_id !== user) {
      db.query(
        INSERTING_SQL_IF_USER_DOES_NOT_EXIST,
        [req.body.user, JSON.stringify(newFriendListOfUser1)],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500);
          }
        }
      );
    }

    if (result[1]?.user_id !== sender && result[0]?.user_id !== sender) {
      db.query(
        INSERTING_SQL_IF_USER_DOES_NOT_EXIST,
        [req.body.sender, JSON.stringify(newFriendListOfUser2)],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500);
          } else {
            res.send({ message: "Friend Added" });
          }
        }
      );
    }
  });
});
router.post("/reject", (req, res) => {
  db.query(
    "select requests from friend_request where user_id IN(?);",
    [req.body.user],
    (err, result) => {
      console.log(result);
      const { requests } = result[0];
      const newRequests = requests.filter(
        (data) => data.sender !== req.body.sender
      );
      db.query(
        "update friend_request set requests = ?",
        [JSON.stringify(newRequests)],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500);
          }
          res.send({ message: "Request rejected" });
        }
      );
    }
  );
});
module.exports = router;
