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
const pdf = require("pdf-poppler");
const docxConverter = require("docx-pdf");

//Image to PDf
// const PDFDocument = require("pdfkit");
// const doc = new PDFDocument();

// doc.pipe(fs.createWriteStream("output1.pdf"));

// doc.image(path.join(__dirname + "/assets/output/one-1.jpg"), {
//   fit: [650, 700],
//   align: "left",
//   valign: "top",
// });
// doc.addPage().image(path.join(__dirname + "/assets/output/one-2.jpg"), {
//   fit: [650, 700],
//   align: "left",
//   valign: "top",
// });
// doc.end();

//End of image to PDF
const input = path.join(
  __dirname + "/assets/files/admin-myFile-1634968940629.pdf"
);
const output = path.join(__dirname + "/assets/output/jorsan.pdf");
const file = "./salbegh.docx";

//DocX to Pdf COnverter

// docxConverter(file, output, (err, result) => {
//   if (err) {
//     console.log(`Error Converting File:${err}`);
//   }
//   console.log("result" + result);
// });

//

//Convert Pdf to Image

// let file = "./one.pdf";

// pdf.info(file).then((pdfinfo) => {
//   console.log(pdfinfo);
// });

// let opts = {
//   format: "jpeg",
//   out_dir: path.join(__dirname + "/assets/output"),
//   out_prefix: path.basename(file, path.extname(file)),
//   page: null,
// };

// pdf
//   .convert(file, opts)
//   .then((res) => {
//     console.log("Successfully Converter");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//End of Pdf to Image
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
const imageFilter = function (req, file, cb) {
  if (
    file.mimetype.split("/")[1] == "png" ||
    file.mimetype.split("/")[1] == "jpg" ||
    file.mimetype.split("/")[1] == "jpeg" ||
    file.mimetype.split("/")[1] == "pdf" ||
    file.mimetype.split("/")[1] == "docx" ||
    file.mimetype.split("/")[1] == "doc"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new Error("Only .png, .jpg and .jpeg pdf docx docformat allowed!")
    );
  }
};

// var upload = multer({ storage: storage, fileFilter: imageFilter });
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.split("/")[1] === "pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a PDF or JPG or DOCX File!!"), false);
//   }
// };

const upload = multer({
  storage: multerStorage,
  fileFilter: imageFilter,
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
