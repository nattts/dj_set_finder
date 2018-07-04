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
