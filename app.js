const express = require("express");
app = express();
const path = require("path");
const PORT = 5000;
const router = require("./router/index");
const fs = require("fs");
let list = "";
const multer = require("multer");
const { exec } = require("child_process");
const pdftoImage = require("pdftoimage");
const libre = require("libreoffice-convert");
const outputFilePath = Date.now() + "output.pdf";
// const outputPdfPath = Date.now() + "output1.pdf";
const outputPdfIPath = Date.now() + "output1.png";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dir = "assets";
const subDir = "assets/uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
  fs.mkdirSync(subDir);
}
app.get("/", router);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/gif" ||
    file.mimetype == "image/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

app.post("/imageToPdf", upload.array("files", 1000), (req, res) => {
  list = "";
  if (req.files) {
    req.files.forEach((file) => {
      list += `${file.path}`;
      list += " ";
    });
    console.log(list);
  }
  exec(`magick convert ${list} ${outputFilePath}`, (err, stderr, stdout) => {
    if (err) {
      console.log(err);
    }
    res.download(outputFilePath, (err) => {
      if (err) throw err;

      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
        fs.unlinkSync(outputFilePath);
      });
    });
  });
});

const pdftoImageFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    return cb("This Extension is not supported");
  }
  cb(null, true);
};

const pdftoImageUpload = multer({
  storage: storage,
  fileFilter: pdftoImageFilter,
});
app.post("/pdfToImg", pdftoImageUpload.single("pdfFile"), (req, res) => {
  let pdflist = "";
  if (req.file) {
    console.log(req.file);
    console.log(req.file.path);
    pdflist += `${req.file.path}`;
  }
  exec(`magick convert ${pdflist} ${outputPdfIPath}`, (err, stderr, stdout) => {
    if (err) {
      console.log(err);
      fs.unlinkSync(pdflist);
      fs.unlinkSync(outputPdfIPath);
    }
    console.log(outputPdfIPath);
    res.download(outputPdfIPath, (err) => {
      if (err) {
        fs.unlinkSync(pdflist);
        fs.unlinkSync(outputPdfIPath);
      }
      fs.unlinkSync(pdflist);
      fs.unlinkSync(outputPdfIPath);
    });
  });
});
const DocumentFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== ".docx" && ext !== ".doc") {
    return cb("This Extension is not supported");
  }
  cb(null, true);
};
const word = multer({ storage: storage, fileFilter: DocumentFilter });

app.post("/docxtopdf", word.single("documents"), (req, res) => {
  if (req.file) {
    console.log(req.file.path);
    let x = fs.readFileSync(req.file.path);
    libre.convert(x, ".pdf", undefined, (err, done) => {
      if (err) {
        console.log(err);
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(outputPdfPath);
      }
      fs.writeFileSync(outputPdfPath, done);
      res.download(outputPdfPath, (err) => {
        if (err) {
          fs.unlinkSync(req.file.path);
          fs.unlinkSync(outputPdfPath);
        }
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(outputPdfPath);
      });
    });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Starts successfully");
  }
});
