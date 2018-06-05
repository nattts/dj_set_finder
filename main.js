
var app = (function (){

const socket = io.connect('http://127.0.0.1:7000/');

	function optionSelector(){
		var select = document.querySelector('.form-control');
			select.addEventListener("change",function(){
			for (var i=1;i<select.children.length;i++){
				var choice = select.children[i];
					if(choice.selected === true){
						var choiceString = choice.innerText; 
						socket.emit('pass',choiceString);
					}
				}
			});

		socket.on('resp', function(response){
			for (var i in response){
				var obj = response[i];
  				var key = Object.keys(obj);
				addScript.addZipScript(obj[key[0]],obj[key[1]],obj[key[2]]);  
			}
		});
	}
	
		var addScript = function(){
			
			var addZipScript = function(artist,key,file){
				
				var div = createElementWithClass("div","row");
				var trackList = document.querySelector('.track-list').appendChild(div);
				var name = createElementWithClass("p", "name");
					nameText = document.createTextNode(artist);  
					appendElement(name,nameText);
				var respDiv = createElementWithClass("div", "col-sm");
				
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


				appendElement(respDiv,script);
				appendElement(respDiv,iframe);
				appendElement(div,respDiv);
				appendElement(respDiv,name);
			};

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
				var trackList = document.querySelector('.track-list').appendChild(div);

			};

			var createElementWithClass = function(tag,classname){
				var element = document.createElement(`${tag}`);
					element.className = `${classname}`;
					return element;
			}	

			var appendElement = function(parent,child){
				return parent.appendChild(child);
			}

			return{
				addZipScript:addZipScript,
				addMixCloudScript:addMixCloudScript,
				
			};

		}();	




	function djSearch(){
		
		var button = document.querySelector('.btn');
		
			button.addEventListener("click",function(){
			var textContent = document.getElementById("input").value;		
				return fetching(textContent)
					.then(function(result){

						for (var each of result){
							addScript.addMixCloudScript(each);
						}
			})
			.catch(function(error) {
   				console.log(error.message);
  			});

			
		});
		
			 function fetching (txtcont){
				return fetch(linkToFetch(txtcont))
					.then(function(data) {
						var jsoned = data.json();
						return jsoned;
    				})
    				.then(function(obj){
    					var arr = []; 
    					if(obj.data.length === 0){
    						var trackList = document.querySelector('.track-list')
    						var div = createElementWithClass("div","row");
    						var note = createElementWithClass("p","text");
    							note = document.createTextNode("no results"); 
	    						appendElement(div,note);
	    						appendElement(trackList,div);
    					} else{
    					for (var d in Object.keys(obj.data)){
    						arr.push(obj.data[d].url);
    					}
    					}
    					return arr;
    				})
    				.catch(function(error) {
   						console.log(error.message);
  					});
			}

		
  	}			  	

	var linkToFetch = function(str){
    	str = str.split(' ').join('');
    	var linkToModify = `https://api.mixcloud.com/search/?q=${str}&type=cloudcast`;
		return linkToModify;	
	};	

return{
	optionSelector:optionSelector,
	djSearch:djSearch
};

}());

window.onload = function(){

	app.optionSelector();
	app.djSearch();
};

