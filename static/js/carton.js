(function() {
	var COLORS = [ "rouge", "rose", "vert", "jaune" ];

	var sync = function() {
		COLORS.forEach(function(color) {
			$("li[component='post']").removeClass("carton-" + color + "-post");
			$("span.carton-" + color).each(function() {
				$(this).closest("li[component='post']").addClass("carton-" + color + "-post");
			});
		});
	};

	$(window).on('action:posts.loaded', sync);
	$(window).on('action:posts.edited', sync);
	$(window).on('action:ajaxify.contentLoaded', sync);

})();
