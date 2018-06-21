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
var pubsub = require("./pubsub.js")  ;

var optionModule = (function(){

	const socket = io.connect('http://127.0.0.1:7000/');
	var dropDownElement = document.querySelector('.form-control');
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

	function socketing(){
		return new Promise(function(resolve,reject){
			var that = this;
			that.socket = socket;
			that.socket.on('resp', function(response){
				resolve(response);
	  		});
				
			
		});
	}

	function optionSelector(){
		
		pubsub.subscribe('reset',reset);
		
		dropDownElement.addEventListener("change",function(){
			

			return pubsubing()
			
			.then(function(){
				return selecting();
			})
			 .then(function(){
			 	return socketing();
			 	
			 })
			 .then(function(response){
			 	for (var i in response){
					var obj = response[i];
		  			var key = Object.keys(obj);
		  			addZipScript(obj[key[0]],obj[key[1]],obj[key[2]]);  
  			
  					}
			 })
			.catch(function (err) {
				throw new Error("something went wrong"); 

			});
		

		});
			
	}		

	
	function selecting(){
		return new Promise(function(resolve,reject){
		try{
		var that = this;
		
		that.dropDownElement = dropDownElement;
		that.socket = socket;
		var choiceValue = that.dropDownElement.value;
		var choiceText = that.dropDownElement.options[that.dropDownElement.selectedIndex].text;
			
		if(choiceValue === '1'){
			that.socket.emit('pass',choiceText);
			resolve(choiceText);
		}	

		}catch(e){
			console.log(e);
			console.log(e.message);
		}

		});
	}
			
	var addZipScript = function(artist,key,file){

		var div = createElementWithClass("div","row");
			appendElement(trackList,div);	
		
		var name = createElementWithClass("p", "name");
			nameText = document.createTextNode(artist);  
			appendElement(name,nameText);
	
		
		var script = document.createElement("script"); 
			script.type = "text/javascript";
		var replacer = /""/;
		 
		var innerHTML = "var zippywww=\"\";var zippyfile=\"\";var zippytext=\"#000000\";var zippyback=\"#e8e8e8\";var zippyplay=\"#ff6600\";var zippywidth=280;var zippyauto=false;var zippyvol=80;var zippywave = \"#000000\";var zippyborder = \"#cccccc\";";
		var replaced = innerHTML.replace(replacer ,`\"${key}\"`);
			script.innerHTML = replaced.replace(replacer,`\"${file}\"`);
			

		var iframe = createElementWithClass("iframe", "script-iframe");
		var zippyLink ="http://api.zippyshare.com/api/jplayer_embed.jsp?key=\"\"&server=www\"\"&width=580";
		
		var replacedKey = zippyLink.replace(replacer, file);
		var replacedWWW = replacedKey.replace(replacer,key);
			
			iframe.src = replacedWWW;
			iframe.frameBorder = "0";
			iframe.scrolling="no";
			iframe.width = "580";
			//iframe.autotart = "true";

		
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
var pubsub = (function() {

var topics = {};

  return {
    subscribe: function(topic, listener) {
      // создаем объект topic, если еще не создан
      if(!topics[topic]) topics[topic] = { queue: [] };

      // добавляем listener в очередь
      var index = topics[topic].queue.push(listener) -1;

	// предоставляем возможность удаления темы
	return {
		remove: function() {
			delete topics[topic].queue[index];
		}
	};
    },
    publish: function(topic, info) {
      // если темы не существует или нет подписчиков, не делаем ничего
      if(!topics[topic] || !topics[topic].queue.length) return;

      // проходим по очереди и вызываем подписки
      var items = topics[topic].queue;
      items.forEach(function(item) {
      		item(info || {});
      });
    }
  

};

})();

module.exports = pubsub;
},{}],4:[function(require,module,exports){
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

},{"./pubsub.js":3}]},{},[1]);
