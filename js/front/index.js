App.extend('index', (function (w, $) {
	var _resizeList = [];
	var plugin = {
		init: function () {
			if ($(w).scrollTop() === 0) {
				w.scrollTo(0, 0);
			}
			_resizeList = $(".fullImage, .full-bg-image");
			$("a.menu").on('click', function () {
				$(".nav").toggleClass('expanded');
			});
			$(".nav a").on('click', function (e) {
				$(".nav").removeClass('expanded');

				//e.stopImmediatePropagation();
				var hash = $(this).attr("href").replace('#', '');
				if (hash) {
					$dest = $("a[name='" + hash + "']");
					if ($dest.length) {
						e.preventDefault();
						$(document.body).animate({
							scrollTop: $dest.offset().top - 100
						});
						document.location.hash = '#' + hash;
					}

				}
			});

			$('.getStarted').on('click', function () {
				App.fn.quiz.start();
			});

			resizeWindow();
			$(w).on('resize', resizeWindow);

			$("#collection").slick({

			});
		}
	};

	var resizeWindow = function () {
		$(_resizeList).each(function (i, e) {
			var $el = $(e);
			var $p = $el.parent();

			var esize = {
				w: $el.width(),
				h: $el.height(),
				pw: $p.width(),
				ph: $p.height()
			};
			var config = {};
			if (esize.w > esize.h) {
				config = {
					'background-size': esize.w + 'px auto'
				};
			} else {
				config = {
					'background-size': 'auto ' + esize.h + 'px'
				};
			}
			if ($el.hasClass('half')) {
				config['background-position-x'] = ($el.hasClass('half-left') ? 0 : esize.pw / 2) + 'px';
				config['background-position-y'] = 'inherit';
			}
			$el.css(config);
			if ($el.hasClass('full-bg-image')) {
				$p.height($('img', $el).height());
			}

		});
	};

	return plugin;

})(window, jQuery));