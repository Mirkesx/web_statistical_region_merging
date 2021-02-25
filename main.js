/**
 * Loading Modules
 */

var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    _ = require('underscore');

/**
 * Global Variables
 */
const port = 8080;

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