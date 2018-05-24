var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var f = function (www){

	var req = function(x){

		return new Promise(function(resolve,reject){
		
			request(x,function(err,response,body){
				if (!err && response.statusCode === 200){
						resolve(body);
					}
				});
		});
	};

	var gatherLinks = function(body){
		return new Promise(function(resolve,reject){
			var links = [];
			var $ = cheerio.load(body);
				$('.cat-box-content').children().each(function(i,element){
			
					if ($(element).text()){
						var linx = $(this).attr('class','.recent-item').find('h3').find('a').attr('href');
						links.push(linx);
					}
					
				});
				resolve(links);
				
		
		});
		
	};	


	var gatherZippy = function(body){
		return new Promise(function(resolve,reject){
			
			var $ = cheerio.load(body);
			var src = $('.entry').html();
			var reg = /(https)(.*)(html)/g;
			var matched = src.match(reg)[0];
			resolve(matched);
		});
	};
	

return req(www)
	.then(function(body){

		return gatherLinks(body);
	})
	.then(function(linksArr){
		return new Promise(function(resolve,reject){
			arr = [];
			
			for (var each of linksArr){
				f(each);
				
			}
				
        			
		   function f(param){

		        return req(param)
		        	.then(function(lnk){
		        		return gatherZippy(lnk);
		        	})
		        	.then(function(r){
		        		arr.push(r);
		        					
		        		if (arr.length === linksArr.length){ 
		        			resolve(arr);
		        			}
		        		}).catch(function(err){
		       				arr.push('undefined');
		       			});
		    }			
		   			
			
		});
		
	 }).then(function(zippies){

		 zippies = zippies.filter(function(item){
			return item !== "undefined";
		}).map(function(item){
			var regWWW = /([\d]+)/g;
			var regFile = /.*\/([^/]+)\/[^/]+/;
			var zippywww = item.match(regWWW)[0];
			var zippyfile = item.match(regFile)[1];
			return {
				zippywww:zippywww,
				zippyfile:zippyfile
			};
		});
		return zippies;
	     				
	}).catch(function (err) {
		throw err; 

	});

};
//f('http://' + 'www.global-sets.com/');

module.exports.f = f;
