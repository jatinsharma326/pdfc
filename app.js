const express = require("express");
app = express();
const path = require("path");
const PORT = 8000;
const fs = require("fs");
const router = require("./router/index");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pdfImg = require("pdf-poppler");
const multer = require("multer");
const pdfDocument = require("pdfkit");
const ImagesToPdfPackage = require("images-to-pdf-package");
const fileSchema = new mongoose.Schema({
  filePath: String,
});
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("assets"));

const fileModel = mongoose.model("file", fileSchema);

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "assets/convert");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb://localhost:27017/file", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//Img to Pdf

// const pathh = path.resolve(__dirname, 'assets')
//If their consist of any database then use that data

app.get("/", (req, res) => {
  fileModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else if (data.length > 0) {
      res.render("index", { data: data });
    } else {
      res.render("index", { data: [] });
    }
  });
});

app.post("/", upload.single("file"), (req, res) => {
  const x = "convert/" + req.file.originalname;
  const file = new fileModel({
    filePath: x,
  });
  file.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
// Make a path for the file
app.get("/imgToPDf/:id", (req, res) => {
  const doc = new pdfDocument();
  doc.pipe(fs.createWriteStream("assets/output/nl.pdf"));
  fileModel.findById({ _id: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const x = "output/";
      doc.image(x, {
        fit: [650, 700],
        align: "center",
        valign: "center",
      });
    }
  });
});
//PDF to Image
app.get("/pdfImg", (req, res) => {
  let file = fileModel.find({ _id: req.params.id });
  //It is used for getting the info about the pdf
  pdfImg.info(file).then((pdfinfo) => {
    console.log(pdfinfo);
  });
  let opts = {
    format: "png",
    out_dir: "assets/output",
    out_prefix: path.basename(file, path.extname(file)),
    page: null,
  };
  pdfImg
    .convert(file, opts)
    .then((res) => {
      console.log("Succesfully Converted");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/download/:id", (req, res) => {
  fileModel.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const x = __dirname + "/assets/" + data[0].filePath;
      res.download(x);
    }
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Starts successfully");
  }
});
