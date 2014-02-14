"use strict";
var fs = require('fs');

String.prototype.replaceAll = function (find, replace) {
	var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

module.exports = {

	writeFileToDisk: function (fileName, data, callback) {
		console.log(data)
		var filePath = __dirname.replaceAll('lib', '') + "uploads/videos/" + fileName;
		fs.writeFile(filePath, data, function (err) {
			callback(err);
		});
	},

	encrypt: function (data) {
		var cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.key);  
		return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
	},

	decrypt: function (data) {
		var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
		return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
	}

};


