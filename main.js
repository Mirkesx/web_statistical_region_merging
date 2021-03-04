/**
 * Loading Modules
 */

var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    _ = require('underscore'),
    multer = require('multer'),
    uuidv1 = require('uuid').v1,
    formidable = require("formidable"),
    bodyParser = require('body-parser');

const { spawn } = require('child_process');
app.use(bodyParser.json())

/**
 * Global Variables
 */
const port = 8080;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
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

app.post('/upload', function (req, res) {
    console.log("Received request!");
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.name = uuidv1() + "-" + file.name
        file.path = __dirname + '/public/uploads/' + file.name;
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        obj = {
            "success": "Upload Completed",
            "status": 200,
            "file_name": file.name
        }
        res.send(JSON.stringify(obj));
    });
});

app.post('/performSRM', function (req, res) {
    console.log("Received request to run SRM!");
    console.log(JSON.stringify(req.body));
    var filename = req.body.file_name;
    var q = req.body.qvalue;
    var k1 = req.body.k1;
    var k2 = req.body.k2;
    var color = req.body.color;

    const python = spawn('python', ['./srm.py', filename, q, k1, k2, color]);

    var largeDataSet = [];
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        largeDataSet.push(data);
    });

    python.stderr.on('data', function (data) {
        console.log('Pipe error from python script ...');
        largeDataSet.push(data);
    });

    // in close event we are sure that stream is from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        console.log(largeDataSet.join(""));

        if (code == 0) {
            console.log("SRM Completed!");
            var obj = {
                "success": "SRM Completed",
                "status": 200,
                "data": {
                    "original": `public/uploads/original_${filename.split(".")[0]}.png`,
                    "segmented": `public/uploads/segmented_${filename.split(".")[0]}.png`,
                    "borders": `public/uploads/borders_${filename.split(".")[0]}.png`,
                    "seg_borders": `public/uploads/seg_borders_${filename.split(".")[0]}.png`
                }
            }
            res.send(JSON.stringify(obj));
        } else {
            console.log("SRM Failed!");
            var obj = {
                "error": "SRM Failed",
                "status": 500
            }
            res.send(JSON.stringify(obj));
        }
    });
});

/**
 * 
 * Manage WebSocket Server
 */



http.listen(port, '0.0.0.0', function () {
    console.log(`[SERVER] - Listening on 0.0.0.0:${port}`);
});
