(function() {

"use strict";

var User = module.parent.require('./user');

exports.addScripts = function(scripts, callback) {
	scripts.concat(['plugins/nodebb-plugin-carton/js/carton.js']);
	return callback(null, scripts);
};

exports.parse = function(data, callback) {
	if (!data || !data.postData || !data.postData.content) {
		return callback(null, data);
	}

	User.isAdminOrGlobalMod(data.uid, function(err, isAdminOrGlobalMod) {
		if(isAdminOrGlobalMod) {
			data.postData.content = data.postData.content
				.replace(/<p>%carton jaune%/g, "<p><span class=carton-jaune></span>")
				.replace(/<p>%carton rouge%/g, "<p><span class=carton-rouge></span>");
		} else {
			data.postData.content = data.postData.content
				.replace(/<p>%carton jaune%/g, "<p>")
				.replace(/<p>%carton rouge%/g, "<p>");
		}
	
		return callback(null, data);
	});
};


})();
