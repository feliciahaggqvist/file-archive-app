const upload = require("../middleware/uploadFile");
/* const FileSchema = require('../models/FileSchema'); */

const baseUrl = "http://localhost:8081/files/";

const fs = require("fs");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: " Select a file to upload" });
    }
      /* let file = new FileSchema({
        filename: req.file.filename,
        description: req.body.description,
        url: baseUrl + req.file.filename,
        mimetype: req.file.mimetype,
        uploaded_by: req.body.uploaded_by,
      });

      try {
        file = await file.save();

      } catch (error) {
        console.log(error);
      } */

    /* Remove after implemented db: */
    res.json({
      filename: req.file.filename,
      url: baseUrl + req.file.filename,
      mimetype: req.file.mimetype,
      /* description: req.body.description,
        uploaded_by: req.body.uploaded_by,
        uploaded_at: new Date().toISOString()*/
    });
    res.status(200).send({
      message: `The file was uploaded successfully: ${req.file.filename}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error occured: ${error}`,
    });
  }
};

const getFiles = (req, res) => {
  const path = __basedir + "/uploads/";

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Cannot find files.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push({
        name: file,
        url: baseUrl + file,
        mimetype: "text/xml",
        description: "this is a file",
        uploaded_by: "Felicia",
        uploaded_at: "2021-11-13",
      });
    });

    res.status(200).send(filesList);
  });
  /* try {
    const files = await FileSchema.find({});
    res.status(200).send(files);
  } catch (err) {
    res.status(400).send({
      message: `Unable to show files: ${err}`,
    })
  } */
  
};

const downloadFiles = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/uploads/";

  res.download(path + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: `Unable to download file: ${err}`,
      });
    }
  });
};

const deleteFile = (req, res, err) => {
  const fileName = req.params.name;
  const path = __basedir + "/uploads/";

  if (!fileName) {
    res.status(500).send({
      message: `No such file: ${err}`,
    });
  }

  try {
    unlink(path + fileName);
    res.status(200).send({
      message: `Successfully deleted the file: ${fileName}`,
    });
  } catch (err) {
    return res.status(400).send({
      message: `Unable to delete file`,
    });
  }
};

module.exports = { uploadFile, getFiles, downloadFiles, deleteFile };
