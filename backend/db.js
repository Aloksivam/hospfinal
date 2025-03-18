const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change if needed
  password: "Al9ok@1411", // Change if needed
  database: "hospital_db", // Make sure this database exists
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("Connected to MySQL database.");
  }
});

module.exports = db;
