const express = require("express");
app = express();
const File = require("./model/fileSchema");
const db = require("./config/database");
const path = require("path");
const PORT = 8000;
const router = require("./router/index");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const pdf2img = require("pdf2img");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Config for static-files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());

app.use(express.static("assets"));
//Config of multer
// const upload = multer({ dest: "assets/files" });
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

//Creating my own Filter So that only a single type of file will be uploaded

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

app.post("/api/uploadFile", upload.single("myFile"), async (req, res) => {
  // console.log(req.file);
  try {
    const newFile = await File.create({
      name: req.file.filename,
    });

    res.status(200).json({
      status: "success",
      message: "File Created Successfully!!",
    });
    // return res.redirect("/api/getFiles");
  } catch (error) {
    res.json({
      error,
    });
  }
});
// {"_id":"6173f5c93f160f3cdd41fe12","name":"files/admin-myFile-1634989513574.pdf","createdAt":"2021-10-23T11:45:13.608Z","__v":0}]}
app.get("/api/getFiles", async (req, res) => {
  try {
    const files = await File.find();
    const input = path.join(__dirname + `/assets/files/${files.name}`);
    pdf2img.setOptions({
      type: "png",
      size: 1024,
      density: 600,
      ouputdir: path.join(__dirname + "/assets/convert"),
      outputname: ``,
    });

    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.join({
      status: "Fail",
      error,
    });
  }
});
app.get("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Starts successfully");
  }
});

module.exports = app;
