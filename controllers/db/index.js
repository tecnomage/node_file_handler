const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
const multer  = require('multer');
const path = require('path');
const fs = require('fs');


const upload = multer({ dest: 'uploads/' });

const fileEndPoints = (app) => {
  app.get("/allfiles", (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json(rows);
    });
  });

  app.post('/sendFiles', upload.single('file'), (req, res) => {
    const file = req.body;
    console.log(file);  
    res.json({ id: 1 });

    // Move the file to a new location
    // const newLocation = path.join(__dirname, 'saved_files', file.originalname);
    // fs.rename(file.path, newLocation, (err) => {
    //   if (err) {
    //     console.error(err);
    //     res.status(500).send('Error processing file');
    //     return;
    //   }
    //   db.run('INSERT INTO files(file_path) VALUES(?)', [newLocation], function(err) {
    //     if (err) {
    //       return console.log(err.message);
    //     }
    //     res.json({ id: this.lastID, file_path: newLocation });
    //   });
    // });
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
