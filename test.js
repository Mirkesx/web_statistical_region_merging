//https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f./LibSRM/
const { spawn } = require('child_process');

var filename = 'ff441150-7cc3-11eb-93e2-790cd252080b-spidy.jpg';
var q = 10;
var k1 = 3;
var k2 = 3;

const python = spawn('python', ['./srm.py', filename, q, k1, k2]);

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
});