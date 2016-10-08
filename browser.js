// nodejs base
var os = require("os");
var fs = require("fs");
var util = require('util');
var path = require('path');
var url = require("url");
var childProcess = require('child_process');

// requires npm install
var express = require('express');
var uuid = require('node-uuid');
var bodyParser = require('body-parser');

var browserPath, browserUserDataFolder;

process.on('uncaughtException', function (err) {
    console.log('process.on(uncaughtException): ' + err + '\n');
});

if (os.platform() === 'win32') { // windows
    browserPath = "c:\\PROGRA~2\\Google\\Chrome\\Application\\chrome.exe";
    browserUserDataFolder = process.env.TEMP + "\\google_data\\restbot\\";

} else if (os.platform() === 'darwin') { // mac
    browserPath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    browserUserDataFolder = process.env.TMPDIR + "/google_data/restbot/";

} else
    throw new Error('OS not supported - platform = ' + os.platform());

var sessionDataPath = browserUserDataFolder + 'temp123'
var chromeExtensionPath = path.resolve(__dirname, 'chrome_extension');
var spawn = childProcess.spawn;

var startupArgs = ["--no-default-browser-check", "--no-first-run", "--test-type", "--ignore-certificate-errors",
    "--disable-popup-blocking", "--extensions-on-chrome-urls", "--user-data-dir=" + sessionDataPath,
    "--load-extension=" + chromeExtensionPath, "about:blank"];

console.log('Starting browser...');

/*
var browser = spawn(browserPath, startupArgs, { detached: true, stdio: 'ignore'});
browser.unref();
*/

var browser = spawn(browserPath, startupArgs);
