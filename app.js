const express = require('express');
const api = require('./routes/api');

const app = express();

const hostname = '127.0.0.1';
const port = 9000;

app.use(api);

app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});