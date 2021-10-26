const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const File = require("../model/fileSchema");

const userController = require("../controllers/index");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

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

//Creating my own Filter So that only a single type of file will be uploaded

router.post(
  "/uploadFile",
  upload.single("myFile"),
  userController.uploadingPost
);
router.get("/getFiles", userController.gettingFiles);
module.exports = router;
