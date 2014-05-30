App.extend('dashboard', (function (w, $) {
	/**
	 * Sticky Sub Nav
	 */
	var $el,
		_htop = 0,
		_stop = 0,
		_active = false,
		_stuck = false;

	var plugin = {
		init: function () {
			$el = $(".subnav");
			if ($el.length) {
				_active = true;
				_htop = $(".header").height();

				$(w).on('scroll', updateSubnav);
				$(w).on('resize', setFixedProps);


				setTimeout(function () {
					_stop = $el.offset().top;
					updateSubnav();
				}, 250);
			}
		}
	};

	var updateSubnav = function () {
		if (!_active) return;
		var st = $(w).scrollTop();
		if (st > (_stop - _htop)) {
			if (!_stuck) {
				_stuck = true;
				setFixedProps();
			}
		} else {
			if (_stuck) {
				_stuck = false;
				$el.attr('style', '');
			}
		}
	};

	var setFixedProps = function () {
		if (!_active || !_stuck) return;
		_htop = $(".header").height();
		$el.attr('style', '');
		$el.css({
			position: 'fixed',
			top: _htop + 10,
			left: $el.offset().left - 10,
			width: $el.width()
		});
	};

	return plugin;

})(window, jQuery));