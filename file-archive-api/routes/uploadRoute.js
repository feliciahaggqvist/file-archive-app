const express = require('express');
const router = express.Router();
const uploadFileController = require('../controller/uploadFileController');

let routes = (app) => {
    router.post('/upload', uploadFileController.uploadFile)
    router.get('/files', uploadFileController.getFiles)
    router.get('/files/:name', uploadFileController.downloadFiles)

    app.use(router);
};

module.exports = routes;


