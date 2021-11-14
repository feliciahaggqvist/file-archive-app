const util = require('util');
const multer = require('multer');
const DIR = "./uploads/"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        let [filename, extension] = file.originalname.split('.');
        let nameFile = filename + '-' + Date.now() + '.' + extension;
        cb(null, nameFile)
    }
})

let upload = multer({ 
    storage: storage, 
    filterFile: (req, file, cb) => {
        if (file.mimetype == 'text/xml' || 'application/pdf' || 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("The following file types are allowed: .xml, .pdf. and .jpeg."))
        }
    }
}).single('file');

let uploadFileMiddleware = util.promisify(upload);

module.exports = uploadFileMiddleware;