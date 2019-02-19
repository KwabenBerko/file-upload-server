const express = require("express");
const multer = require("multer");
const morgan = require("morgan");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext != ".jpg" && ext != ".png" && ext != ".jpeg") {
      return cb(new Error("Please upload an image"));
    }

    cb(null, true);
  },
  limits: { files: 1, fileSize: 1000000 }
});
app.use(morgan("dev"));

app.get("/", (req, res, next) => {
  res.json({
    message:
      "A simple node server for file uploads for testing uploads from clients."
  });
});

app.post("/upload", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    const err = new Error("No file found.");
    err["status"] = 400;
    return next(err);
  }
  console.log(req.file);
  console.log(req.body);	

  res.status(204).send();
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err["status"] = 404;
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error."
    }
  });
});

app.listen(7000, () => console.log("File Upload Server Running"));
