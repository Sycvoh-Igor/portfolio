require('babel-core/register');
const path = require('path');
const fs = require('fs');
const imageFolder = 'assets/images/';
const videoFolder = 'assets/videos/';
const baseUrl = require('etc/baseUrl.js');
['.css', '.less', '.sass', '.scss', '.ttf', '.woff', '.woff2', '.woff2'].forEach((ext) => require.extensions[ext] = () => {});
['.svg', '.png', '.jpg'].forEach((ext) => require.extensions[ext] = (module, filename) => {
	var name = path.basename(filename);
	module.exports = baseUrl + imageFolder + name;
});
['.mp4'].forEach((ext) => require.extensions[ext] = (module, filename) => {
	var name = path.basename(filename);
	module.exports = baseUrl + videoFolder + name;
});
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
require('babel-polyfill');
require('server.js');

