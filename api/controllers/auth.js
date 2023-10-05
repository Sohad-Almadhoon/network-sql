import db from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  // CHECK USER IF EXISTS
  const q = "select * from users where username = ?";
  db.query(q, [req.body.username], async(err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");
    // CREATE A NEW USER
    //Hash the password
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword =await bcrypt.hashSync( req.body.password, salt);
    const q =
      "INSERT INTO users(`username`,`email`,`password`,`name`) values (?, ?, ?, ?)";
    const { username, email, name } = req.body;
    db.query(q, [username, email, hashedPassword, name], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created!");
    });
  });
};
export const login = (req, res) => {
  const q = "select * from users where username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User is not found!");
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username");
    const token = jwt.sign({ id: data[0].id }, "secretKey");
    const { password, ...others } = data[0];
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out!");
};
