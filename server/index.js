const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
//const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.static("files"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.json({message:'backend!'})
})

app.post("/upload", (req, res) => {
  const newpath = __dirname + "/files/";
  const file = req.files.file;
  const filename = file.name;

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});

app.listen(3001, () => {
  console.log("Server running successfully on 3000");
});
