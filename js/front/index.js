App.extend('index', (function (w, $) {
	var _$model,
		_$container;

	var _profiles = [{
		n: "Bella - Re/Juventate",
		d: "Student, model, photographer"
	}, {
		n: "Chow - Re/Molding",
		d: "Artist."
	}, {
		n: "Cynthia - Re/Bloomed",
		d: "Mother, Creative Director, Founder of Masion Mittweg."
	}, {
		n: "Anastasia - Re/Generate",
		d: "Mode, Photographer, Russian."
	}, {
		n: "Tatiana - Re/Create",
		d: "Student and Model."
	}, {}];
	var plugin = {
		init: function () {
			_$model = $(".model");
			_$container = $(".split.r");
			var l = _profiles.length;
			var pick = Math.floor(Math.random() * l);
			var index = (pick + 1);
			var forceFade = setTimeout(function () {
				_$model.fadeIn();
				onResize();
			}, 1200);
			_$model.hide().attr('src', 'assets/img/models/' + index + '.jpg').on('load', function () {
				clearTimeout(forceFade);
				onResize();
				$(this).fadeIn();
			});


			var profileHtml = "";
			if (_profiles[pick].n) {
				profileHtml = "<h1>Individual N&ordm;: 00" + index + "</h1>" +
					"<h3>" + _profiles[pick].n + "</h3>" +
					"<p>" + _profiles[pick].d + "</p>";
			}
			$(".profile").hide().html(profileHtml).fadeIn();


			$(w).on('resize', onResize);
			onResize();
		}
	};

	var onResize = function () {
		var w = _$container.width(),
			h = _$container.height(),
			mw = _$model.width(),
			mh = _$model.height();


		if (window.innerWidth < 600) {
			_$model.css({
				'position': 'fixed',
				'height': h
			});
		} else {
			_$model.css({
				'position': 'absolute',
				'height': h
			});
		}
	};

	return plugin;

})(window, jQuery));