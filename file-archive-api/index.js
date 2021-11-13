const express = require('express');
const app = express();
const routes = require('./routes/uploadRoute');

global.__basedir = __dirname;

routes(app);
const port = 8081;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})

app.use(function (err, req, res, next) {
    console.error(err.message);
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});