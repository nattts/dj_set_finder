var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var toScrape = function (www){
	
	var req = function(source){

		return new Promise(function(resolve,reject){
		
			request(source,function(err,response,body){
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
			track = {};
			var $ = cheerio.load(body);
			var name = $('.post-inner').find('h1').find('span').text();
			var src = $('.entry').html();
			var reg = /(https)(.*)(html)/g;
			var matched = src.match(reg)[0];
			track.name = name;
			track.src = matched;
			
			resolve(track);
		});
	};
	

return req(www) 		/* making 1st request to gather links to interate later  */
	.then(function(body){

		return gatherLinks(body);  
	})
	.then(function(linksArr){   /* collecting actual links from zippyshare.com */
		return new Promise(function(resolve,reject){
			arr = [];
			for (var each of linksArr){
				linksCollection(each);
			}
				
        			
		   function linksCollection(param){ /*function to make 2nd request to collect actual links. 
		   						puttin everything into array including with 'undefinds'*/
				return req(param)
		        	.then(function(lnk){
		        		return gatherZippy(lnk);
		        	})
		        	.then(function(link){
		        		arr.push(link);
		        				
		        		if (arr.length === linksArr.length){ 
		        			resolve(arr);
		        			}
		        		}).catch(function(err){
		       				arr.push('undefined');
		       			

		       			});
		    }			
		   			
			
		});
		
	 }).then(function(zippies){ 	/* pushing valid links into array, 
	 								extracting metadata and checking if liks are valid */
	 	
		 zippies = zippies.filter(function(item){
		 	
			return item !== "undefined";
		}).map(function(item){
			var key = Object.keys(item);
			var artist = item[key[0]];
			var regWWW = /([\d]+)/g;
			var regFile = /.*\/([^/]+)\/[^/]+/;
			var zippywww = item[key[1]].match(regWWW)[0];
			var zippyfile = item[key[1]].match(regFile)[1];
			
			
/*putting all into object with 3 keys: artist - name and name of the set; 
key (2 digit string) to be inserted in the iframe on the client side;
file name (another string to be inserted into iframe) */

			return {				
									
				artist:artist,
				zippywww:zippywww,
				zippyfile:zippyfile					
			};
			

		});
		return zippies;
	    

	}).catch(function (err) {
		throw new Error("something went wrong"); 

	});

};

module.exports = {toScrape: toScrape};
