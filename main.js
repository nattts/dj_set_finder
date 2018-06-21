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

