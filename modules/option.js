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
