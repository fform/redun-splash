App.extend('modal', (function (w, $) {


	var plugin = {
		init: function () {

		},
		start: function (template, config) {
			var mhtml = $("#T_modal").html();
			var thtml = $("#T_" + template).html();
			if (!template || thtml === "") {
				throw "No Template";
			}
			var $el = $(_.template(mhtml, {
				inner: $(_.template(thtml, config.params || {}))
			}));


			$el.on('click', plugin.destroy);
			$("a.close", $el).on('click', plugin.destroy);
			$($el).on('click', function (e) {
				e.stopPropagation();
			});

			$("body ").append($el);


		}
	};

	return plugin;

})(window, jQuery));