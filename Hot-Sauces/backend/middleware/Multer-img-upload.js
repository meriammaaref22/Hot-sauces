const multer= require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
}
});

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = {upload}
