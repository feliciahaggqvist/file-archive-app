const upload = require("../middleware/uploadFile");

const baseUrl = "http://localhost:8081/files/";
const allUploads = [];
const jsonDbFilepath = "objectStorage.json";

const fs = require("fs");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: " Select a file to upload" });
    }
    res.json({
      filename: req.file.filename,
      url: baseUrl + req.file.filename,
      mimetype: req.file.mimetype,
      description: req.body.description,
      uploaded_by: req.body.uploaded_by,
      uploaded_at: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error occured: ${error}`,
    });
  }

  allUploads.length = 0;
  if (fs.existsSync(jsonDbFilepath)) {
    let text = fs.readFileSync(jsonDbFilepath);
    allUploads.push(...JSON.parse(text));
  }

  const content = {
    filename: req.file.filename,
    url: baseUrl + req.file.filename,
    mimetype: req.file.mimetype,
    description: req.body.description,
    uploaded_by: req.body.uploaded_by,
    uploaded_at: new Date().toLocaleDateString(),
  };
  allUploads.push(content);

  const filename = jsonDbFilepath;

  fs.writeFile(
    filename,
    JSON.stringify(allUploads),
    { flag: "w" },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("File is created successfully.");
      }
    }
  );
};

const getFiles = (req, res) => {
  let text = fs.readFileSync(jsonDbFilepath);
  let allUploadsDeserialized = JSON.parse(text);
  res.status(200).send(allUploadsDeserialized);
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

const deleteFile = async (req, res, err) => {
  const fileName = req.params.name;
  const path = __basedir + "/uploads/";

  if (!fileName) {
    res.status(500).send({
      message: `No such file: ${err}`,
    });
  }

  allUploads.length = 0;
  if (fs.existsSync(jsonDbFilepath)) {
    let text = fs.readFileSync(jsonDbFilepath);
    allUploads.push(...JSON.parse(text));
  }

  try {
    await unlink(path + fileName);
    res.status(200).send({
      message: `Successfully deleted the file: ${fileName}`,
    });

    const chosenFile = allUploads?.find(
      (content) => content.filename === fileName
    );
    if (chosenFile) {
      if (allUploads.length === 1) {
        allUploads.length = 0;
      } else {
        const index = allUploads.indexOf(chosenFile);
        if (index > -1) {
          allUploads.splice(index, 1);
        }
      }

      fs.writeFile(
        jsonDbFilepath,
        JSON.stringify(allUploads),
        { flag: "w" },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("File is removed from db.");
            console.log(allUploads);
          }
        }
      );
    }
  } catch (err) {
    return res.status(400).send({
      message: `Unable to delete file`,
    });
  }
};

module.exports = { uploadFile, getFiles, downloadFiles, deleteFile };
