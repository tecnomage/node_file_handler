const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

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
    console.log("file", file);
    
const inputFilePath = file.path ; // Replace with actual file path
const outputFilePath = 'compressed_file.txt.gz'; // Adjust as needed

fs.createReadStream(inputFilePath)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(outputFilePath))
  .on('finish', () => {
    console.log('File compressed successfully!');
  })
  .on('error', (err) => {
    console.error('Compression error:', err);
  });

    
    //const filePath = path.join(__dirname, "..", "uploads", file.filename);

    //console.log("file", filePath);

    // //Check if the file exists
    // if (fs.existsSync(filePath)) {
    //   // Compress the file
    //   const compressedFilePath = filePath + ".gz";
    //   const gzip = zlib.createGzip();
    //   const input = fs.createReadStream(filePath);
    //   const output = fs.createWriteStream(compressedFilePath);
    //   input.pipe(gzip).pipe(output);

    //   db.run(
    //     "INSERT INTO files (file_path) VALUES (?)",
    //     [compressedFilePath],
    //     (err) => {
    //       if (err) {
    //         console.log("Error inserting file path", err);
    //         res.status(500).json({ error: "Failed to insert file path" });
    //       } else {
    //         console.log("File path inserted");
    //         res.json("File path inserted");
    //       }
    //     }
    //   );
    // } else {
     
    //   fs.readFile(inputImagePath, (err, buffer) => {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       sharp(buffer)
    //         .jpeg({ quality: 50 }) // Adjust compression quality as needed
    //         .toBuffer()
    //         .then((compressedBuffer) => {
    //           // Write the compressed Buffer to a file
    //           fs.writeFile(outputImagePath, compressedBuffer, (err) => {
    //             if (err) {
    //               console.error(err);
    //             } else {
    //               console.log('Image compressed and written to file successfully!');
    //             }
    //           });
    //         })
    //         .catch((err) => {
    //           console.error('Compression error:', err);
    //         });
    //     }
    //   });
    
    
    //}

    res.json({ file: file });
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
