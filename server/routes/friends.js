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

router.post("/", (req, res) => {
  const { userId } = req.body;

  let sql = `
  select user_data.user_id,first_name,last_name,profile_pic from user_data
  JOIN ( 
  select friend_id ,user_id from friends as T1 
  JOIN json_table(
      T1.friend,
  "$[*]" columns(friend_id INT PATH "$.friend")
  ) AS T2
  where T1.user_id=?
  ) AS result
  ON result.friend_id=user_data.user_id
  where result.user_id=?;
    ;
    `;
  db.query(sql, [userId, userId], async (error, Result) => {
    if (error) {
      console.log(error);
    }
    if (Result.length > 0) {
      let newResult = [];
      await Promise.all(
        Result.map(async (friend) => {
          let dataOfMutualFriends = [];

          const mutualFriendsId = await new Promise((resolve, reject) => {
            db.query(
              "SELECT friend from friends where user_id=?",
              [friend.user_id],
              async (err, result) => {
                if (err) {
                  throw new Error("Not Found ");
                } else {
                  const user1Friends = new Set(
                    result[0]?.friend.map((friend) => friend.friend) || []
                  );
                  const user2Friends = new Set(
                    Result.map((friend) => friend.user_id)
                  );
                  const commonFriends = [...user1Friends].filter((x) =>
                    user2Friends.has(x)
                  );

                  resolve(commonFriends);
                }
              }
            );
            //! end of mutual friend
          });

          await Promise.all(
            mutualFriendsId.map(async (userId) => {
              const data = await new Promise((resolve, reject) => {
                db.query(
                  "SELECT first_name,last_name,profile_pic from user_data where user_id =?",
                  [userId],
                  (err, result) => {
                    if (err) {
                      reject(new Error("Something went wrong"));
                      console.log(err);
                    } else {
                      resolve(result[0]);
                    }
                  }
                );
              });
              dataOfMutualFriends.push(data);
            })
          );
          newResult.push({
            ...friend,
            dataOfMutualFriends,
            noOfMutualFriends: mutualFriendsId.length,
          });
        })
      );
      res.send(newResult);
    } else {
      res.status(400);
    }
  });
});

router.post("/mutualFriend", async (req, res) => {
  const { user, sender } = req.body;
  let dataOfMutualFriends = [];

  const myFriends = await new Promise((resolve, reject) => {
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

  const mutualFriendsId = await new Promise((resolve, reject) => {
    db.query(
      "SELECT friend from friends where user_id=?",
      [sender],
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
    mutualFriendsId.map(async (userId) => {
      const data = await new Promise((resolve, reject) => {
        db.query(
          "SELECT first_name,last_name,profile_pic from user_data where user_id =?",
          [userId],
          (err, result) => {
            if (err) {
              reject(new Error("Something went wrong"));
              console.log(err);
            } else {
              resolve(result[0]);
            }
          }
        );
      });
      dataOfMutualFriends.push(data);
    })
  );
  res.send(dataOfMutualFriends);
});

router.get("/addFriendSuggestion/:id", (req, res) => {
  let SQL = `
  select user_id, first_name, last_name ,profile_pic from user_data where user_id in (
    select distinct friend_id from friends as R1
    join 
    JSON_TABLE(
        R1.friend,
        "$[*]" columns(friend_id INT PATH "$.friend")
     ) as T
    
     where friend_id != ? and friend_id not in
    
        (select distinct friend_id from friends as R2 
           join 
           JSON_TABLE(
           R2.friend,
           "$[*]" columns(friend_id INT PATH "$.friend")
           ) as T1
           where user_id = ?) 
    
     and user_id in
    
     (select distinct friend_id from friends as R3
        join 
        JSON_TABLE(
            R3.friend,
            "$[*]" columns(friend_id INT PATH "$.friend")
         ) as T2
         where user_id = ?)
     )
     limit 20;
  `;
  db.query(
    SQL,
    [req.params.id, req.params.id, req.params.id],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

module.exports = router;
