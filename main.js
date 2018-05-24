
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

		socket.on('resp', function(reply){
			console.log(reply);
		});
	}
	
	function createScript(data){

		var addScript = function(){
			var div = document.createElement("div");
			var trackList = document.querySelector('.track-list').appendChild(div);
			
			var script = document.createElement("script"); 
				script.type = "text/javascript";
				script.innerHTML = "var zippywww=\"100\";var zippyfile=\"ASKb9MoX\";var zippytext=\"#000000\";var zippyback=\"#e8e8e8\";var zippyplay=\"#ff6600\";var zippywidth=280;var zippyauto=false;var zippyvol=80;var zippywave = \"#000000\";var zippyborder = \"#cccccc\";";
			
			var iframe = document.createElement('iframe');
				iframe.src ="http://api.zippyshare.com/api/jplayer_embed.jsp?key=ASKb9MoX&server=www100";
				iframe.frameBorder = "0";
				iframe.scrolling="no";
				
			var appendedScriptEl = div.appendChild(script);
			var appended_ifreameScriptEl = div.appendChild(iframe);
				trackList.appendChild(appendedScriptEl);
				trackList.appendChild(appended_ifreameScriptEl);
		};


		var button = document.querySelector('.add');
			button.addEventListener("click", addScript);

	}


return{
	optionSelector:optionSelector,
	createScript:createScript
};


}());


window.onload = function(){

	app.optionSelector();
	app.createScript({ zippywww: '6', zippyfile: 'VaTozeWO' });
	
};

