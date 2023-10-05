import db from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

/* Get Stories */
export const getStories = (req, res) => {
  const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) LIMIT 4`;
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
/* Add Stories */
export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(req.body);
    const q = "INSERT INTO stories (`img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.imgUrl,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created`");
    });
  });
};
/* Delete Stories */
export const deleteStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "delete from stories where `id` = ? and `userId` = ?";
    console.log(req.params.id);
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      console.log(data);
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json("Deleted!");
      return res.status(403).json("You can delete only your story! ");
    });
  });
};