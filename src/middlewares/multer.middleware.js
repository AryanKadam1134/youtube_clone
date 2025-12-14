import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // For a unique file name
    cb(null, file.originalname); // It is recommended to use a unique file name to avoid the possibilities of files with the same name
  },
});

export const upload = multer({ storage: storage });
