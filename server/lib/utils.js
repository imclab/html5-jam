"use strict";
var fs = require('fs');
var crypto = require('crypto');
var config = require('../config');
var util = require('util');
var child_process = require('child_process');

String.prototype.replaceAll = function (find, replace) {
	var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

function puts(error, stdout, stderr) {
  stdout ? util.print('stdout: ' + stdout) : null;
  stderr ? util.print('stderr: ' + stderr) : null;
  error ? console.log('exec error: ' + error) : null;
}


module.exports = {

	writeFileToDisk: function (filePath, data, callback) {
		fs.writeFile(__dirname.replaceAll('lib', '') + config.server.uploads + filePath, data, callback);
	},

	readFileFromDisk: function (filePath, callback) {
		fs.readFile(__dirname.replaceAll('lib', '') + config.server.uploads + filePath, callback);
	},

	deleteFileFromDisk: function (filePath, callback) {
		fs.unlink(__dirname.replaceAll('lib', '') + config.server.uploads + filePath, callback);
	},

	encrypt: function (data) {
		var cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.key);  
		return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
	},

	decrypt: function (data) {
		var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
		return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
	},

	createFolder: function (path) {
		var path = __dirname.replaceAll('lib', '') + config.server.uploads + path;
		console.log("Creating folder :".debug + path);
		fs.mkdir(path);
	},

	mergeAudioVideo: function (filePath) {
		console.log("Merging audio and video :".debug + filePath);
		var exec = child_process.exec;
		var path = __dirname.replaceAll('lib', '') + config.server.uploads + filePath;
		console.log('bite ' +  filePath)
		exec("ffmpeg -i " + path + ".webm -i " + path + ".wav -map 0:0 -map 1:0 " + path + ".webm", puts);
	}

};
