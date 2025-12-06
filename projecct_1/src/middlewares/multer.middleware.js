import multer from 'multer';

// using disk storage engine || we can use memory storage as well
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp") // specify the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ storage: storage })