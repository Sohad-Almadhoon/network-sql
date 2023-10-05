import mysql from "mysql2";

// Create a connection object
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "social",
  password: "goodgirl12345",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});
export default db;