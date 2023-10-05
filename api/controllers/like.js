import db from "../connect.js";
import jwt from "jsonwebtoken";
/* Get Likes */
export const getLikes = (req, res) => {
  const q = `SELECT userId from likes where postId = ? `;
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

/* Add Like */
export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "INSERT INTO likes (`userId` , `postId`) VALUES (?)";
    const values = [userInfo.id, req.query.postId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like has been created`");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "delete from likes where userId = ? and postId = ?";
    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like has been deleted`");
    });
  });
};
