const express = require("express");
const multer = require('multer');

const app = express();
const port = 8081;

const filterFile = function(req, file, cb) {
    const validTypes = ['text/xml', 'application/pdf', 'image/jpeg'];
    

    if (!validTypes.includes(file.mimetype)){ //TODO: check what a mimetype is
        const error = new Error("Not valid file type");
        error.code = "LIMIT_FILE_TYPES"; //TODO: change error code
        return cb(error, false);
    }

    cb(null, true);
}

const upload = multer({
    dest: './uploads/',
    filterFile,
})

/* app.get('/', (req, res) => {
    res.
})
 */
app.post('/file-archive-api/upload', upload.single('file'), (req, res) => {
    res.json({file: req.file, description: req.body.description})
});

app.use(function(err, req, res, next) {
    if (err.code === "LIMIT_FILE_TYPES"){
        res.status(422).json({error: 'Allowed file types are: xml, pdf and jpeg'});
        return;
    }
});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));