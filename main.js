
var app = (function (){

var socket = io.connect('http://127.0.0.1:7000/');

	function optionSelector(){
		var select = document.querySelector('.select');
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
				addScript(obj[key[0]],obj[key[1]],obj[key[2]]);  
			}
		});
	}
	
		var addScript = function(artist,key,file){
			
			var div = document.createElement("div");
				div.className = "wrapper";
			var trackList = document.querySelector('.track-list').appendChild(div);
			var name = document.createElement("p");
				name.className = "name";
				nameText = document.createTextNode(artist);  
				name.appendChild(nameText);
				
			var respDiv = document.createElement("div");
				respDiv.className = "resp-div";

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
			
				iframe.src = replacedWWW;
				iframe.frameBorder = "0";
				iframe.scrolling="no";
				iframe.width = "580";


			respDiv.appendChild(script);
			respDiv.appendChild(iframe);
			div.appendChild(respDiv);
			div.appendChild(name);
		};

return{
	optionSelector:optionSelector,

};

}());

window.onload = function(){

	app.optionSelector();

};

