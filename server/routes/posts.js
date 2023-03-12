require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { v4: uuid } = require("uuid");
const mysql = require("mysql2");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require("express-mysql-session")(session);
const formidable = require("formidable");

const GETTING_POST_SQL = `
SELECT user_data.user_id,first_name,last_name,profile_pic,gender,posts.*,count(postlikes.post_id) as total_likes, count(comments.post_id) as total_comments,
exists(select user_id from postlikes where user_id=? and postLikes.post_id=posts.post_id) as hasLiked
FROM posts
left outer join postlikes on  posts.post_id =postLikes.post_id
left outer join comments on comments.post_id =posts.post_id
join user_data on user_data.user_id=posts.user_id
 where posts.user_id = ? or posts.user_id in (
	select friend_id from friends as R1 join json_table(
    R1.friend, 
    "$[*]" columns(friend_id INT path "$.friend")
) as R2 
where user_id = ? 
)
group by posts.post_id
order by case when user_data.user_id=? then 0 else 1 end,posts.uploaded_at desc
limit 5 offset ?;
`;
const GETTING_MY_POST = `
select first_name,last_name,profile_pic,gender, posts.* ,count(comments.post_id) as total_comments,count(postlikes.post_id) as total_likes,exists(select user_id from postlikes where user_id=? and postLikes.post_id=posts.post_id) as hasLiked
from posts
left join user_data on user_data.user_id=posts.user_id
left outer join comments on posts.post_id=comments.post_id
left outer join postlikes on posts.post_id=postlikes.post_id
where posts.user_id=?
group by posts.post_id
order by posts.uploaded_at desc
limit 1;`;

const GETTING_COMMENTS_SQL = `
select comments.* , count(commentLikes.comment_id) as total_likes,first_name,last_name,profile_pic from comments
left outer join commentLikes on commentLikes.comment_id = comments.comment_id
left join user_data on user_data.user_id = comments.user_id
where post_id =?
GROUP BY comments.comment_id
limit 10;
`;

const LIKE_POST = "insert into postlikes(post_id,user_id) values(?,?);";
const UNLIKE_POST = "delete from postlikes where user_id = ? and post_id = ?";
const INSERTING_POSTS = "insert into posts values(?,?,?,?,?,?)";

const INSERTING_COMMENTS =
  "insert into comments(comment,comment_id,commented_on,parent_id,post_id,user_id) values(?,?,?,?,?,?)";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./posts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const sessionStore = new MySQLStore({
  host: process.env.HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.DB_PASS,
  database: "facebook",
});

const upload = multer({ storage });

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

const db = mysql.createConnection({
  user: "Deepak",
  host: process.env.HOST,
  database: "facebook",
  password: "Deepak",
  connectTimeout: 30000,
});

router.get("/posts/:userId", (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page);

  if (req.query.page !== undefined && page === NaN) {
    res.send("Please provide a valid page number");
  }

  const offset = page ? page + 4 : 0;
  db.query(
    GETTING_POST_SQL,
    [userId, userId, userId, userId, offset],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const newResult = result.map((post) => {
        let additional_comment =
          post.type === "profile"
            ? post.gender === "Male"
              ? "updated his profile picture"
              : "updated her profile picture"
            : null;
        return {
          ...post,
          additional_comment,
        };
      });

      res.send(newResult);
    }
  );
});

router.get("/comments/:postId", (req, res) => {
  const { postId } = req.params;
  db.query(GETTING_COMMENTS_SQL, [postId], (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send(result);
  });
});

router.post("/posts", formDataMiddleware, async (req, res) => {
  const { user, caption, type } = req.body;
  const post_id = crypto.randomUUID();
  const files = req.files;
  console.log(files);
  const fileToBeUploadedToDB = [];

  await Promise.all(
    files.map(async (file) => {
      const fileName = `${file.newFilename}-${Date.now()}`;
      const fileContent = await fs.promises.readFile(file.filepath);

      await sharp(fileContent)
        .metadata()
        .then((metadata) => {
          const width = metadata.width;
          const height = metadata.height;
          const isVertical = height > width;
          const ratio = width / height;
          const maxDimension = isVertical ? Math.floor(ratio * 1080) : 1080;
          const minDimension = isVertical ? 1080 : Math.floor(ratio * 1080);
          sharp(fileContent)
            .resize({
              width: maxDimension,
              height: minDimension,
              fit: "contain",
            })
            .jpeg({ mozjpeg: true })
            .toFile(`./posts/${fileName}.jpg`);
        });

      fileToBeUploadedToDB.push(
        `http://192.168.1.75:3001/posts/${fileName}.jpg`
      );
    })
  );
  const dataToInsertIntoDB = [
    post_id,
    user,
    caption,
    JSON.stringify(fileToBeUploadedToDB),
    new Date(),
    type ? "profile" : type,
  ];

  db.query(INSERTING_POSTS, dataToInsertIntoDB, (err, result) => {
    if (err) console.log(err);
    res.send({ success: true, post_id: post_id });
  });
});

router.get("/posts/myPost/:userId", async (req, res) => {
  const { userId } = req.params;
  db.query(GETTING_MY_POST, [userId, userId], (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(result);
  });
});

router.delete("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  if (req.session?.isAuth) {
    db.query("delete from posts where post_id = ?", [postId], (err) => {
      if (err) {
        console.log(err);
        res.status(500);
      }
      res.send("Successfully deleted");
    });
  } else {
    res.status(400).send("Please login to your account first");
  }
});

function formDataMiddleware(req, res, next) {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    req.body = fields;
    req.files = Array.isArray(files.photo)
      ? [...files.photo]
      : files.photo
      ? [files.photo]
      : [];
    next();
  });
}

router.post("/posts/like", (req, res) => {
  const { user, post_id } = req.body;

  db.query(LIKE_POST, [post_id, user], (err) => {
    if (err) {
      console.log(err);
    }
    res.send({ success: true });
  });
});

router.post("/posts/unlike", (req, res) => {
  const { user, post_id } = req.body;
  console.log(user, post_id);
  db.query(UNLIKE_POST, [user, post_id], (err) => {
    if (err) {
      console.log(err);
      res.send({ success: false });
    }
    res.send({ success: true });
  });
});

router.get("/posts/comments/:commentId", (req, res) => {
  const post = req.params.commentId;
  db.query(GETTING_COMMENTS_SQL, [post], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Internal Server Error");
    }
    res.send(result.length > 0 ? result : []);
  });
});

router.post("/posts/comment", (req, res) => {
  const { comment, post_id, comment_id, user_id, parent_id, commented_on } =
    req.body;

  console.log(comment_id);
  db.query(
    INSERTING_COMMENTS,
    [comment, comment_id, commented_on, parent_id, post_id, user_id],
    (err) => {
      if (err) {
        console.log(err);
        return res.send("Internal Server Error");
      }
      res.send({ success: true });
    }
  );
});
module.exports = router;
