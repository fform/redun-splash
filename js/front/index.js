App.extend('index', (function (w, $) {
	var _$model,
		_$container,
		_emailReg = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi,
		_tto;

	var _profiles = [{
		n: "Bella - Re/Juventate",
		d: "Student, model, photographer"
	}, {
		n: "Chow - Re/Molding",
		d: "Artist."
	}, {
		n: "Cynthia - Re/Bloomed",
		d: "Mother, creative director, founder of maisonmittweg.com"
	}, {
		n: "Anastasia - Re/Generate",
		d: "Model, photographer, Russian."
	}, {
		n: "Tatiana - Re/Create",
		d: "Student and Model."
	}, {
		n: "Chloe - Re/Flection",
		d: "Stylist and twin."
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
				profileHtml = "<h1>N&ordm;: 00" + index + "</h1>" +
					"<h3>" + _profiles[pick].n + "</h3>" +
					"<p>" + _profiles[pick].d + "</p>";
			}
			$(".profile").hide().html(profileHtml).fadeIn();


			$(w).on('resize', onResize);
			onResize();

			$(".signup input").on('keyup', function (e) {
				var key = e.keyCode || e.which;
				if (key === 13) {
					submitForm();
				}
			}).on('focus', hideTips);

			$(".signup .button").on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				submitForm();
			});
		}
	};

	var submitForm = function () {
		var el = $("#email");
		var val = el.val(),
			form = $("#signup");
		if ($(".signup").hasClass('submitting')) {
			showTip("Hold on, trying to save that");
			return;
		}
		if (_emailReg.test(val)) {
			if ($("#ghost").val()) {
				/* Spam entry */
				$(".signup").remove();
			} else {
				$(".signup").addClass('submitting');
				$(".signup .button").text("Submitting ...");
				$.post("/signup", {
					'email': val
				}, function (r) {
					if (r === true) {
						$(".signup").addClass('hide');
						$(".registered").addClass('done');
					} else {
						$(".signup").removeClass('submitting');
						$(".signup .button").text("Get Early Access");
						showTip("Couldn't save that email. Try again?", true);
					}
				});
			}

		} else {
			showTip("Invalid Email", true);
		}
	};

	var showTip = function (msg, error) {
		error = error === true;
		var el = $(".signup input");
		$(".signup .tip")
			.text(msg)
			.toggleClass('error', error)
		//.width(el.width())
		.height(el.height())
			.addClass('show');
		_tto = setTimeout(hideTips, 1500);
	};

	var hideTips = function () {
		$(".tip:visible").removeClass('show');
		clearTimeout(_tto);
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