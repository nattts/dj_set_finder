let pubsub = require("./pubsub.js");

let djSearchModule = (function(){
	
	let isFull = false;
	let trackList = document.querySelector('.track-list');
	let dropDownElement = document.querySelector('.form-control');

	let appendElement = function (parent,child){
		return parent.appendChild(child);
	};

	let createElementWithClass = function(tag,classname){
		let element = document.createElement(`${tag}`);
			element.className = `${classname}`;
			return element;
		};

	function reset(){
		let that = this;
		that.trackList = trackList;
		trackListArray = Array.from(that.trackList.childNodes);
		for (let n in trackListArray){
			let item = trackListArray[n];
			item.parentNode.removeChild(item);
		}
	}

	function pubsubing(){
		return new Promise(function(resolve,reject){
			let that = this;
			that.isFull = true;
			resolve(pubsub.publish('isFull', that.isFull));
		});
	}		


	function djSearch(){
		
		let that = this;
		that.isFull = isFull;
		that.dropDownElement = dropDownElement;
		
		pubsub.subscribe('isFull',function(result){
			that.isFull = result;
		});
		
		let button = document.querySelector('.btn');
			button.addEventListener("click",function(){
			
			let textContent = document.getElementById("input").value;		
				
				if(that.isFull){
					reset();
					that.isFull = false;
					that.dropDownElement.value = '0';
				} 

				if(that.isFull === false){
				
					return fetching(textContent)
				
					.then(function(data){
						return jsoning(data);
					})
					.then(function(data){
						return gettingArrayOfLinks(data);
					})
					.then(function(result){
						
						
						if (result != undefined){
							for (let each of result){
								addMixCloudScript(each); 
							}
						}
						
					})
					.then(function(){
						return pubsubing();
					})
					.catch(function(error) {
   						console.log(error.message);
  					});
			}
		});
	}

	function gettingArrayOfLinks(jsonData){
		return new Promise(function(resolve,reject){
			let links = []; 
			if(jsonData.data.length === 0){
					
				let div = createElementWithClass("div","row");
				let note = createElementWithClass("p","text");
					note = document.createTextNode("no results or service unavailable. try again later"); 
					appendElement(div,note);
					appendElement(trackList,div);
				} else {
					for (let d in Object.keys(jsonData.data)){
						links.push(jsonData.data[d].url);
					}
				}
			resolve(links);
		});
	}	

	function jsoning(dataFromFetch){
		return new Promise(function(resolve,reject){
			let jsoned = dataFromFetch.json();
			resolve(jsoned);
		});
	}

	function fetching (txtcont){
		return new Promise(function(resolve,reject){
		resolve(fetch(linkToFetch(txtcont)));
		});
	}

	let addMixCloudScript = function (lnk){
		const ending = "embed-html/";
		const api = 'api';
		
		let iframe = document.createElement('iframe');
			iframe.width = "100%";
			iframe.height = "120";
			iframe.src = lnk + ending;
			iframe.src = iframe.src.replace("www",api);
			iframe.frameBorder="0";
			iframe.scrolling="no";

		let div = createElementWithClass("div", "row");

		appendElement(div,iframe);
		appendElement(trackList,div);		
	};
	
	let linkToFetch = function(str){
    	str = str.split(' ').join('');
    	let linkToModify = `https://api.mixcloud.com/search/?q=${str}&type=cloudcast`;
		return linkToModify;	
	};	

	return {
		djSearch:djSearch
	};


}());

module.exports = djSearchModule;
