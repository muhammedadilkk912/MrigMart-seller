const multer = require('multer');
// const path=require('path')

// const storage = multer.diskStorage({   
//   destination: function (req, file, cb) {
//     console.log(file)
//     cb(null, 'C:/Users/adilk/OneDrive/Pictures/logoimage'); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     const extension = path.extname(file.originalname);
//     const uniqueName = `${file.originalname}-${file.fieldname}.${extension}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });
console.log("inside")
const storage=multer.memoryStorage()
const upload = multer({ storage });


module.exports = upload;
