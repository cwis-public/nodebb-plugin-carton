(function() {

"use strict";

var async = require("async");
var user = module.parent.require('./user');
var posts = module.parent.require('./posts');
var groups = module.parent.require('./groups');
var NodeBB = require.main;
var nbbSettings = NodeBB.require('./src/settings');
var winston = NodeBB.require('winston');

var COLORS_ANIM = [ "rose", "vert" ],
	REGEXPS_ANIM = COLORS_ANIM.map(function(color) { return new RegExp("<p>%carton " + color + "%", "g"); });
var COLORS = [ "jaune", "rouge" ],
	REGEXPS = COLORS.map(function(color) { return new RegExp("<p>%carton " + color + "%", "g"); });

var settings;

exports.addScripts = function(scripts, callback) {
	scripts.concat(['plugins/nodebb-plugin-carton/js/carton.js']);
	return callback(null, scripts);
};

exports.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/carton',
		icon: 'fa-sticky-note-o',
		name: 'Carton'
	});
	return callback(null, header);
};

function renderAdminPage(req, res, next) {
	res.render('admin/plugins/carton', {});
}

function syncCarton(socket, data, callback) {
	winston.info("[Carton] Settings saved.");
}

exports.init = function(params, callback) {
	var router = params.router;
	var middleware = params.middleware;

	settings = new nbbSettings('carton', '1.0.0', {}, function () {
	});

	router.get('/admin/plugins/carton', middleware.admin.buildHeader, renderAdminPage);
	router.get('/api/admin/plugins/carton', renderAdminPage);

	NodeBB.require('./src/socket.io/admin').settings.syncCarton = syncCarton;
	return callback();
};

exports.parse = function(data, callback) {
	if (!data || !data.postData || !data.postData.content) {
		return callback(null, data);
	}

	async.parallel({
		isAdminOrGlobalMod: function(done) {
			user.isAdminOrGlobalMod(data.postData.uid, done);
		},
		isModerator: function(done) {
			posts.isModerator([ data.postData.pid ], data.postData.uid, done);
		},
		groups: function(done) {
			groups.getUserGroups( [ data.postData.uid ], done);
		}
	}, function(err, results) {
		var isAdminOrGlobalMod = results.isAdminOrGlobalMod,
			isModerator = results.isModerator? results.isModerator[0]: undefined,
			hasPrivs = isAdminOrGlobalMod || isModerator,
			reAnim = new RegExp(settings.get("anim_re")),
			hasPrivsAnim = hasPrivs;

		(results.groups || []).forEach(function(group) {
			hasPrivsAnim = hasPrivsAnim || reAnim.test(group.name);
		});

		if(hasPrivsAnim) {
			COLORS_ANIM.forEach(function(color, i) {
				data.postData.content = data.postData.content
					.replace(REGEXPS_ANIM[i], "<p><span class=carton-" + color + "></span>");
			});
		} else {
			COLORS_ANIM.forEach(function(color, i) {
				data.postData.content = data.postData.content
					.replace(REGEXPS_ANIM[i], "<p>");
			});
		}

		if(hasPrivs) {
			COLORS.forEach(function(color, i) {
				data.postData.content = data.postData.content
					.replace(REGEXPS[i], "<p><span class=carton-" + color + "></span>");
			});
		} else {
			COLORS.forEach(function(color, i) {
				data.postData.content = data.postData.content
					.replace(REGEXPS[i], "<p>");
			});
		}
	
		return callback(null, data);
	});
};


})();
