const upload = require("../middleware/uploadFile");

const baseUrl = "http://localhost:8081/files/";
const allUploads = [];

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
  if (fs.existsSync("objectStorage.json")) {
    let text = fs.readFileSync("objectStorage.json");
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
  console.log("allUploads: ", allUploads);
  const filename = "objectStorage.json";

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
  const path = __basedir + "/uploads/";
  let text = fs.readFileSync("objectStorage.json");

  let allUploadsDeserialized = JSON.parse(text);

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Cannot find files.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      let fileData = allUploadsDeserialized.find((x) => x.filename === file);

      filesList.push({
        filename: fileData?.filename,
        url: fileData?.url,
        mimetype: fileData?.mimetype,
        description: fileData?.description,
        uploaded_by: fileData?.uploaded_by,
        uploaded_at: fileData?.uploaded_at,
      });
    });

    res.status(200).send(allUploadsDeserialized);
  });
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
    // return
  }

  allUploads.length = 0;
  if (fs.existsSync("objectStorage.json")) {
    let text = fs.readFileSync("objectStorage.json");
    allUploads.push(...JSON.parse(text));
  }

  try {
    unlink(path + fileName);
    res.status(200).send({
      message: `Successfully deleted the file: ${fileName}`,
    });

    const chosenFile = allUploads?.find((x) => x.filename === fileName);
    if (chosenFile) {
      if (allUploads.length === 1) {
        allUploads.length = 0;
      }
      const index = allUploads.indexOf(chosenFile);
      if (index > -1) {
        allUploads.splice(index, 1);
      }

      fs.writeFile(
        "objectStorage.json",
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
