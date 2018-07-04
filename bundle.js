(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var optionModule = require("./modules/option.js");
var djSearchModule = require("./modules/search.js");
var pubsub = require("./modules/pubsub.js");

var app = (function (){

return{
	
	optionSelector:optionModule.optionSelector,
	djSearch:djSearchModule.djSearch
};

}());

window.onload = function(){

	app.optionSelector();
	app.djSearch();
	
};


},{"./modules/option.js":2,"./modules/pubsub.js":3,"./modules/search.js":4}],2:[function(require,module,exports){
let pubsub = require("./pubsub.js")  ;

let optionModule = (function(){

	const socket = io.connect('http://127.0.0.1:7000/');
	let isFull = false;
	let dropDownElement = document.querySelector('.form-control');
	let trackList = document.querySelector('.track-list');
	let trackListArray = Array.from(trackList.childNodes);

	
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

	function socketing(){
		return new Promise(function(resolve,reject){
			let that = this;
			that.socket = socket;
			that.socket.on('resp', function(response){
				resolve(response);
	  		});
		});
	}

	function optionSelector(){
		let that = this;
		that.isFull = isFull;
		
		pubsub.subscribe('isFull',function(result){
			that.isFull = result;
		});
		
		dropDownElement.addEventListener("change",function(){
			
			if(that.isFull){
				reset();
				that.isFull = false;
			} 

			if(that.isFull === false){
				return selecting()
				
				 .then(function(){
				 	return socketing();
				 	
				 })
				 .then(function(response){
				 	for (let i in response){
						let obj = response[i];
			  			let key = Object.keys(obj);
			  			addZipScript(obj[key[0]],obj[key[1]],obj[key[2]]);  
	  				}
				 })
				 .then(function(){
					return pubsubing();
				 })
				.catch(function (err) {
					throw new Error("something went wrong"); 
				});
			}
		});
	}		

	
	function selecting(){
		return new Promise(function(resolve,reject){
		let that = this;
		that.dropDownElement = dropDownElement;
		that.socket = socket;
		let choiceValue = that.dropDownElement.value;
		let choiceText = that.dropDownElement.options[that.dropDownElement.selectedIndex].text;
			
			if(choiceValue === '1'){
				that.socket.emit('pass',choiceText);
				resolve(choiceText);
			}
		});
	}
			
	let addZipScript = function(artist,key,file){

		let div = createElementWithClass("div","row");
			appendElement(trackList,div);	
		
		let name = createElementWithClass("p", "name");
			nameText = document.createTextNode(artist);  
			appendElement(name,nameText);
	
		
		let script = document.createElement("script"); 
			script.type = "text/javascript";
		let replacer = /""/;
		 
		let innerHTML = "let zippywww=\"\";let zippyfile=\"\";let zippytext=\"#000000\";let zippyback=\"#e8e8e8\";let zippyplay=\"#ff6600\";let zippywidth=280;let zippyauto=false;let zippyvol=80;let zippywave = \"#000000\";let zippyborder = \"#cccccc\";";
		let replaced = innerHTML.replace(replacer ,`\"${key}\"`);
			script.innerHTML = replaced.replace(replacer,`\"${file}\"`);
			

		let iframe = createElementWithClass("iframe", "script-iframe");
		let zippyLink ="http://api.zippyshare.com/api/jplayer_embed.jsp?key=\"\"&server=www\"\"&width=580";
		
		let replacedKey = zippyLink.replace(replacer, file);
		let replacedWWW = replacedKey.replace(replacer,key);
			
			iframe.src = replacedWWW;
			iframe.frameBorder = "0";
			iframe.scrolling="no";
			iframe.width = "580";
			
		appendElement(div,script);
		appendElement(div,iframe);
		appendElement(div,name);
	};
	
	return {

		optionSelector:optionSelector
	};

	
})();


module.exports = optionModule;

},{"./pubsub.js":3}],3:[function(require,module,exports){
let pubsub = (function() {

let topics = {};

  return {
    subscribe: function(topic, listener) {
    	if(!topics[topic]) topics[topic] = { queue: [] };
			let index = topics[topic].queue.push(listener) -1;

		return {
			remove: function() {
			delete topics[topic].queue[index];
			}
		};
  },

    publish: function(topic, info) {
    	if(!topics[topic] || !topics[topic].queue.length) return;
    		let items = topics[topic].queue;
          items.forEach(function(item) {
      			item(info || {});
      			});
      }
  	};

})();

module.exports = pubsub;
},{}],4:[function(require,module,exports){
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
					note = document.createTextNode("no results or busy server. try again later"); 
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

},{"./pubsub.js":3}]},{},[1]);
