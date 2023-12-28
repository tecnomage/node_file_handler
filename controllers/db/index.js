const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const compress_images = require("compress-images");
const output="./compress/";

//TODO1 retirar o uso do multer
const upload = multer({ dest: "uploads/" });

/**
 * Defines the file endpoints for the application.
 * @param {Object} app - The Express app object.
 */
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

    // Create a gzip stream
    // The level option specifies the compression level to use
    const gzip = zlib.createGzip({ level: 9 });
    const source = fs.createReadStream(file.path);
    const destination = fs.createWriteStream(`${file.path}.gz`);

    // Pipe the file through the gzip stream
    source.pipe(gzip).pipe(destination);

    destination.on('finish', function() {
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Error deleting original file:', err);
            }else{
                console.log('Original file deleted');
                res.send("File compressed successfully");
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

  // app.post("/sendFiles", upload.single("file"), (req, res) => {
  //   const file = req.file;
  //   //console.log(file);

  //   //FIXME1: o caminho usado na compressao dever ser diferente
  // compress_images(
  //   file.path,
  //   output,
  //   { compress_force: false, statistic: true, autoupdate: true },
  //   false,
  //   { jpg: { engine: "mozjpeg", command: ["--quality", "20"] } },
  //   { png: { engine: "pngquant", command: ["--quality=60-80"] } },
  //   { svg: { engine: "svgo", command: "--multipass" } },
  //   {
  //     gif: {
  //       engine: "gifsicle",
  //       command: ["--colors", "64", "--use-col=web"],
  //     },
  //   },
  //   (error, completed, statistic) => {
  //     console.log("-------------");
  //     console.log("Error:", error);
  //     console.log("Completed:", completed);
  //     console.log("Statistic:", statistic);
  //     console.log("-------------");

  //     if (completed) {
  //       // Save file information in the database
  //       console.log("compressed");
  //       const compressedFilePath = `uploads/${file.originalname}`;

  //       // db.run('INSERT INTO files(file_path) VALUES(?)', [compressedFilePath], function(err) {
  //         //     if (err) {
  //         //         return console.log(err.message);
  //         //     }
  //         //     res.json({ id: this.lastID, file_path: compressedFilePath });
  //         // });
  //       res
  //         .status(200)
  //         .json({ status: "ok", message: "File compressed successfully" });
  //     }
  //     else if(error){
  //       res.status(500).json({ status: "error", message: "File not compressed" });
  //     }
  //   }
  // );
  // });
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
