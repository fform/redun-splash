App.extend('login', (function (w, $) {


	var plugin = {
		init: function () {
			$("a.login").on('click', plugin.start);
		},
		start: function () {
			var $el = $(_.template($("#T_login").html(), {

			}));

			$el.on('click', plugin.destroy);
			$("a.close", $el).on('click', plugin.destroy);
			$("#login", $el).on('click', function (e) {
				e.stopPropagation();
			});
			$("a.signup", $el).on('click', plugin.submit);

			$("body").append($el);


		},

		submit: function () {
			console.log("Login");
			document.location = "./dashboard.html";
		},

		destroy: function () {
			$("#loginBackdrop").remove();
		}
	};

	return plugin;

})(window, jQuery));