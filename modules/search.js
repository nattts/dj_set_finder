var pubsub = require("./pubsub.js");

var djSearchModule = (function(){
	

	var trackList = document.querySelector('.track-list');
	var trackListArray = Array.from(trackList.childNodes);

	var appendElement = function (parent,child){
		return parent.appendChild(child);
	};

	var createElementWithClass = function(tag,classname){
		var element = document.createElement(`${tag}`);
			element.className = `${classname}`;
			return element;
	};

function reset(){
		var that = this;
		that.trackList = trackList;
		trackListArray = Array.from(that.trackList.childNodes);
		for (var n in trackListArray){
			var item = trackListArray[n];
			item.parentNode.removeChild(item);
		}
	}

function pubsubing(){
		return new Promise(function(resolve,reject){
			resolve(pubsub.publish('reset'));
		});
	}		


function djSearch(){
		
		pubsub.subscribe('reset',reset);
		
		var button = document.querySelector('.btn');
			button.addEventListener("click",function(){
			
			var textContent = document.getElementById("input").value;		
				
				return pubsubing()
					.then(function(){
						return fetching(textContent);
					})
					.then(function(data){
						return jsoning(data);
					})
					.then(function(data){
						return gettingArrayOfLinks(data);
					})
					.then(function(result){
						
						
						if (result != undefined){
							for (var each of result){
								addMixCloudScript(each); 
							}
						}
						
					})
					.catch(function(error) {
   						console.log(error.message);
  					});

			
			 });
			
}

	function gettingArrayOfLinks(jsonData){
		return new Promise(function(resolve,reject){
			var links = []; 
			if(jsonData.data.length === 0){
					
				var div = createElementWithClass("div","row");
				var note = createElementWithClass("p","text");
					note = document.createTextNode("no results"); 
					appendElement(div,note);
					appendElement(trackList,div);
					
						
				} else{
				for (var d in Object.keys(jsonData.data)){
					links.push(jsonData.data[d].url);
				}
			}
			resolve(links);
		});
	}	

	function jsoning(dataFromFetch){
		return new Promise(function(resolve,reject){
			var jsoned = dataFromFetch.json();
			resolve(jsoned);
		});
	}

	function fetching (txtcont){
		return new Promise(function(resolve,reject){
		resolve(fetch(linkToFetch(txtcont)));

		});
			
	}

	var addMixCloudScript = function (lnk){
		const ending = "embed-html/";
		const api = 'api';
		
		var iframe = document.createElement('iframe');
			iframe.width = "100%";
			iframe.height = "120";
			iframe.src = lnk + ending;
			iframe.src = iframe.src.replace("www",api);
			iframe.frameBorder="0";
			iframe.scrolling="no";

		var div = createElementWithClass("div", "row");

			
		appendElement(div,iframe);
		appendElement(trackList,div);		
		
		
	};
	
	var linkToFetch = function(str){
    	str = str.split(' ').join('');
    	var linkToModify = `https://api.mixcloud.com/search/?q=${str}&type=cloudcast`;
		return linkToModify;	
	};	

	return {

		djSearch:djSearch
	
	};


}());

module.exports = djSearchModule;
