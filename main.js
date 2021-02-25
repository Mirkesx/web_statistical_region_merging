/**
 * Loading Modules
 */

var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    _ = require('underscore'),
    multer = require('multer');

/**
 * Global Variables
 */
const port = 8080;
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

/**
 * Static files
 */

app.use('/test', express.static('test'));
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

/**
 * Routes definitions
 */

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/test/index.html');
});

/**
 * 
 * Manage WebSocket Server
 */



http.listen(port, '0.0.0.0', function () {
    console.log(`[SERVER] - Listening on 0.0.0.0:${port}`);
});