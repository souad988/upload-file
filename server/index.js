const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(fileUpload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "backend!" });
});

app.post("/upload", (req, res) => {
  const newpath = process.cwd();
  const file = req.files.file;

  const filename = file.name;
  const fileType = file.mimetype.split('/')[1]
  supportedTypes = ['pdf', 'jpg', 'jpeg','docx','xls','txt']
  console.log("name", file, newpath);
  if(supportedTypes.filter(item=> item.toUpperCase() === fileType.toUpperCase()).length > 0){
    file.mv(`${newpath}/files/${fileType}/${filename}`, (err) => {
        if (err) {
        res.status(500).send({
            message: `Failed to upload ${filename} !`,
            code: 200,
            err: err,
        });
        } else {
        res
            .status(200)
            .send({ message: `${filename} Uploaded successfully!`, code: 200 });
        }
    });
  }else{
     res.status(400).send({
       message: `Failed to upload ${filename}!`,
       code: 400,
       err: `${fileType} files not supported!`,
     });
  }

  
});

app.listen(3001, () => {
  console.log("Server running successfully on 3000");
});
