let http = require('http');
let fs = require('fs');
let path = require("path");
let url = require("url");
let scrape = require('./scraper').toScrape;
let socket = require('socket.io');
let Log = require('log'),
logDebug = new Log('debug'); 
logError = new Log('error');
logInfo = new Log('info');


const PORT = 7000;

let server = http.createServer().listen(PORT);

server.on('request', function(request,response){
	
	let mimeTypes = {
        '.html': 'text/html',
      	'.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };
	
	let filePath = '.' + request.url;
	if (filePath == './') {
        filePath = './index.html';
    }
    
	let pathnameParsed = filePath.split('.').pop();
	let ext = '.' + pathnameParsed;
	let contentType = mimeTypes[ext] || 'application/octet-stream';

	fs.readFile(filePath,function(err,contents){
			response.writeHead(200, {'Content-Type': contentType, 'Access-Control-Allow-Origin': '*'});
			response.end(contents, 'utf-8');
	});
   		
});

let io = socket.listen(server);
io.on('connection', function(sock){
	
	sock.on('pass', function(data){
		logInfo.info(data);
		scrape(data).then(function(content){
			io.sockets.emit('resp', content);
			logInfo.info(content);
		});
	});
});

logInfo.info(`running on http://127.0.0.1:${PORT}/`);

