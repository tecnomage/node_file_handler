const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

//TODO1 retirar o uso do multer 
const upload = multer({ dest: "uploads/" });

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

  // ...

  app.post("/sendfiles", upload.single("file"), (req, res) => {
    const file = req.file;

    // Create a gzip transform stream
    const gzip = zlib.createGzip();
    const source = fs.createReadStream(file.path);
    const destination = fs.createWriteStream(`${file.path}.gz`);

    // Pipe the file through the gzip stream
    source.pipe(gzip).pipe(destination);

    destination.on('finish', function() {
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Error deleting original file:', err);
            }
        });

        // Save file information in the database
        const compressedFilePath = `${file.path}.gz`;
        db.run('INSERT INTO files(file_path) VALUES(?)', [compressedFilePath], function(err) {
            if (err) {
                return console.log(err.message);
            }
            res.json({ id: this.lastID, file_path: compressedFilePath });
        });
    });
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
