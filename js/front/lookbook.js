App.extend('lookbook', (function (w, $) {
	var _resizeList = [];
	var plugin = {
		match: /lookbook/ig,
		page: function () {
			console.log("lookbook");
			$("#lookbook").slick({});
			$(".book-page").on('click', shopLook);
			$("#shop-the-look").on('click', shopLook);
			$("#lookbook-dark").on('click', function () {
				$(this).removeClass('open');
				$("#lookbook-over").removeClass('open');
				setTimeout(function () {
					$("#lookbook-dark").addClass('hide');
				}, 250);
			});
		}
	};

	var shopLook = function () {
		var look = $(".slick-active").data('look');
		var html = _.template($("#T_lookbook").html(), {
			'look': look,
			'src': 'assets/img/lookbook/' + look + '.jpg'
		});
		$(".over-inside").html(html);
		$("#lookbook-over").addClass('open');
		$("#lookbook-dark").removeClass('hide').addClass('open');
	};

	return plugin;

})(window, jQuery));