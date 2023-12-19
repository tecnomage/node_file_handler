const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
const multer  = require('multer');
const path = require('path');
const fs = require('fs');


const upload = multer({ dest: 'uploads/' });

const fileEndPoints = (app) => {
  app.get("/allfiles", (req, res) => {
    db.all("SELECT * FROM files f", [], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json(rows);
    });
  });

  app.post('/sendfiles', upload.single('file'), (req, res) => {
    const file = req.file;
    
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);

    db.run(
      "INSERT INTO files (file_path) VALUES (?)",
      [filePath],
      (err) => {
        if (err) {
          console.log("Error inserting file path", err);
          res.status(500).json({ error: "Failed to insert file path" });
        } else {
          console.log("File path inserted");
          res.json("File path inserted");
        }
      }
    );
  });


};

db.run(
  "CREATE TABLE if not exists files(id INTEGER PRIMARY KEY AUTOINCREMENT, file_path TEXT)",
  (err) => {
    if (err) {
      console.log("Error creating table", err);
    } else {
      console.log("Table created");
    }
  }
);

module.exports = {
  fileEndPoints,
};
