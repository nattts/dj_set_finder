var http = require('http');
var fs = require('fs');
var path = require("path");
var url = require("url");
var scrape = require('./scraper').toScrape;
var socket = require('socket.io');
var Log = require('log'),
 logDebug = new Log('debug'); 
 logError = new Log('error');
 logInfo = new Log('info');


const PORT = 7000;

var server = http.createServer().listen(PORT);

server.on('request', function(request,response){
	
	var mimeTypes = {
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
	
	var filePath = '.' + request.url;
	if (filePath == './') {
        filePath = './index.html';
    }
    
	var pathnameParsed = filePath.split('.').pop();
	var ext = '.' + pathnameParsed;
	var contentType = mimeTypes[ext] || 'application/octet-stream';


		fs.readFile(filePath,function(err,contents){
			response.writeHead(200, {'Content-Type': contentType, 'Access-Control-Allow-Origin': '*'});
			response.end(contents, 'utf-8');

			
   		});
   		
});

var io = socket.listen(server);
io.on('connection', function(sock){
	
	sock.on('pass', function(data){
		
		scrape(data).then(function(content){
			io.sockets.emit('resp', content);
			
		});
		
	});
});

logInfo.info(`server listening on http://127.0.0.1:${PORT}/`);

