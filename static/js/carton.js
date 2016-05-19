(function() {
	var sync = function() {
		$("li[component='post']").removeClass("carton-jaune-post").removeClass("carton-rouge-post");

		$("span.carton-jaune").each(function() {
			$(this).closest("li[component='post']").addClass("carton-jaune-post");
		});
		$("span.carton-rouge").each(function() {
			$(this).closest("li[component='post']").addClass("carton-rouge-post");
		});
	};

	$(window).on('action:posts.loaded', sync);
	$(window).on('action:ajaxify.contentLoaded', sync);

})();
