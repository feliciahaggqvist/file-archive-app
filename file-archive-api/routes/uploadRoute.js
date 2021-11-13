const express = require('express');
const router = express.Router();
const uploadFileController = require('../controller/uploadFileController');

let routes = (app) => {
    router.get('/files', uploadFileController.getFiles)
    router.post('/upload', uploadFileController.uploadFile)
    router.get('/files/:name', uploadFileController.downloadFiles)
    router.delete('/files/:name', uploadFileController.deleteFile)
    app.use(router);
};

module.exports = routes;


