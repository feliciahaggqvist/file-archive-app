const upload = require('../middleware/uploadFile')

const baseUrl = 'http://localhost:8081/files/';

const fs = require('fs');

const uploadFile = async (req,res) => {
    try {
        await upload(req, res);

        if( req.file == undefined) {
            return res.status(400).send({ message: ' Select a file to upload' });
        }

        res.status(200).send({
            message: `The file was uploaded successfully: ${req.file.originalname}`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Error occured: ${error}`,
        });
    }
};

const getFiles = (req, res) => {
    const path = __basedir + '/uploads/';

    fs.readdir(path, function (err, files) {
        if (err) {
            res.status(500).send({
                message: 'Cannot find files.',
            });
        }

        let filesList = [];

        files.forEach((file) => {
            filesList.push({
                name: file,
                url: baseUrl + file,
              /*   description: req.body.description, */
            });
        });

        res.status(200).send(filesList);
    });
};

const downloadFiles = (req, res) => {
    const fileName = req.params.name;
    const path = __basedir + '/uploads/';
  
    res.download(path + fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: `Unable to download file: ${err}`,
        });
        res.status(404).send({
            message: `Unable to find the file: ${err}`
        })
      }

    });
};

module.exports = { uploadFile, getFiles, downloadFiles  };