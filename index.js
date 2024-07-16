const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "umar2001",
  database: "matrimony_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connectiong to database:", err.message);
    return;
  }
  console.log("Connected to database");
});

//registration
app.post("/register", (req, res) => {
  const data = req.body;
  console.log(data);

  let userData = {
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    password: data.password,
    role: data.role,
  };

  // Check if email already exists
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSql, [userData.email], (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.message);
      return res.status(500).json({ err: "Internal Server error" });
    }

    if (results.length > 0) {
      // Email already exists
      return res.status(500).json({ err: "Email already exists" });
    } else {
      // Email does not exist, proceed with insertion
      const insertSql = "INSERT INTO users SET ?";
      db.query(insertSql, userData, (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.message);
          return res.status(500).json({ err: "Internal Server error" });
        }
        res.status(201).json({
          message: "User registered successfully",
          body: result,
        });
      });
    }
  });
});

//get_data_registration
app.get("/get_data_register", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.message);
      return res.status(500).json({ err: "Internal Server error" });
    }
    return res.status(201).json({
      message: "User registered successfully",
      body: result,
    });
  });
});

// Delete
app.delete("/delete/:id", (req, res) => {
  const ID = req.params.id;
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [ID], (err, result) => {
    if (err) {
      console.error("Error exewcuting query: " + err.message);
      return res.status(500).json({ err: "inetrnal Server error" });
    }
    return res.status(201).json({
      message: "Users Deleted Successfully",
      body: result,
    });
  });
});

// Update
app.put("/Update_User/:id", (req, res) => {
  const User_ID = req.params.id;
  const { name, email } = req.body;

  if (!User_ID) {
    return res.status(400).json({ error: "Userid is required" });
  }
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const sql = "UPDATE users SET name=?, email =? WHERE id =?";
  console.log(
    `Executing SQL: ${sql} with User_ID: ${User_ID}, Name: ${name}, Email: ${email}`
  );

  db.query(sql, [name, email, User_ID], (err, result) => {
    if (err) {
      console.error("Error while updating", err.message);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Updated Successfully", body: result });
  });
});
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});
