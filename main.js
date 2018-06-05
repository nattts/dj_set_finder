
var app = (function (){

var socket = io.connect('http://127.0.0.1:7000/');

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
				var div = document.createElement("div");
					div.className = "row";
				
				var trackList = document.querySelector('.track-list').appendChild(div);
				
				var name = document.createElement("p");
					name.className = "name";
					nameText = document.createTextNode(artist);  
					name.appendChild(nameText);
					
				var respDiv = document.createElement("div");
					respDiv.className = "col-sm";

				var script = document.createElement("script"); 
					script.type = "text/javascript";
				var replacer = /""/;
				 
				var innerHTML = "var zippywww=\"\";var zippyfile=\"\";var zippytext=\"#000000\";var zippyback=\"#e8e8e8\";var zippyplay=\"#ff6600\";var zippywidth=280;var zippyauto=false;var zippyvol=80;var zippywave = \"#000000\";var zippyborder = \"#cccccc\";";
				var replaced = innerHTML.replace(replacer , '\"' +key+ '\"');
					script.innerHTML = replaced.replace(replacer, '\"' +file+ '\"');
					

				var iframe = document.createElement('iframe');
				var zippyLink ="http://api.zippyshare.com/api/jplayer_embed.jsp?key=\"\"&server=www\"\"&width=580";
				
				var replacedKey = zippyLink.replace(replacer, file);
				var replacedWWW = replacedKey.replace(replacer,key);
					iframe.className = "script-iframe";
					iframe.src = replacedWWW;
					iframe.frameBorder = "0";
					iframe.scrolling="no";
					iframe.width = "580";


				respDiv.appendChild(script);
				respDiv.appendChild(iframe);
				div.appendChild(respDiv);
				respDiv.appendChild(name);
				};

			var addMixCloudScript = function (lnk){
				var ending = "embed-html/";
				var api = 'api';
				var modified = "";
				var iframe = document.createElement('iframe');
					iframe.width = "100%";
					iframe.height = "120";
					
					iframe.src = lnk + ending;
					iframe.src = iframe.src.replace("www",api);
					
					iframe.frameBorder="0";
					iframe.scrolling="no";

				var div = document.createElement("div");
					div.className = "row";
					div.appendChild(iframe);
				var trackList = document.querySelector('.track-list').appendChild(div);

				};

			return{
				addZipScript:addZipScript,
				addMixCloudScript:addMixCloudScript
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
    					for (var d in Object.keys(obj.data)){
    						arr.push(obj.data[d].url);
    					}

    					return arr;
    				})
    				

    				.catch(function(error) {
   						console.log(error.message);
  					});
			}

		
  	}			  	

		

	

	

	var linkToFetch = function(str){
		var linkToModify = "https://api.mixcloud.com/search/?q=party+time&type=cloudcast";
			str = str.split(' ').join('');
		var linkToFetch = linkToModify.replace(/[^q=]*\+\w*(?=&)/,str);
			return linkToFetch;	
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

