let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let toScrape = function (www){
	
	let req = function(source){
		return new Promise(function(resolve,reject){
			request(source,function(err,response,body){
				if (!err && response.statusCode === 200){
						resolve(body);
				}
			});
		});
	};

	let gatherLinks = function(body){
		return new Promise(function(resolve,reject){
			let links = [];
			let $ = cheerio.load(body);
				$('.cat-box-content').children().each(function(i,element){
					if ($(element).text()){
						let linx = $(this).attr('class','.recent-item').find('h3').find('a').attr('href');
						links.push(linx);
					}
				});
				resolve(links);
		});
	};	
	

	let gatherZippy = function(body){
		return new Promise(function(resolve,reject){
			track = {};
			let $ = cheerio.load(body);
			let name = $('.post-inner').find('h1').find('span').text();
			let src = $('.entry').html();
			let reg = /(https)(.*)(html)/g;
			let matched = src.match(reg)[0];
			track.name = name;
			track.src = matched;
			
			resolve(track);
		});
	};
	

return req(www) 		/* making 1st request to gather links to iterate later  */
	.then(function(body){

		return gatherLinks(body);  
	})
	.then(function(linksArr){   /* collecting actual links from zippyshare.com */
		return new Promise(function(resolve,reject){
			arr = [];
			for (let each of linksArr){
				linksCollection(each);
			}
				
        			
		   function linksCollection(param){ /*function to make 2nd request to collect actual links. 
		   						putting everything into array including with 'undefinds'*/
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
			let key = Object.keys(item);
			let artist = item[key[0]];
			let regWWW = /([\d]+)/g;
			let regFile = /.*\/([^/]+)\/[^/]+/;
			let zippywww = item[key[1]].match(regWWW)[0];
			let zippyfile = item[key[1]].match(regFile)[1];
			
			
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
