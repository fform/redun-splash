App.extend('quiz', (function (w, $) {
	var q = [{
		type: "3up",
		title: "How would you describe your style?",
		opts: ["Business Casual", "T Shirt & Jeans", "Dress to Impress"]
	}, {
		type: "3up",
		title: "What is your favorite color to wear?",
		opts: ["Monotone", "Neutrals", "Pop"]
	}, {
		type: "top-size",
		title: "What is your top size?",
		sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
	}, {
		type: "pant-size",
		title: ["What is your pant size?", "What is your bottom fit?"],
		sizes: [28, 29, 30, 31, 32, 33, 34, 46, 38, 40, 42, 44],
		opts: ["Straight", "Relaxed"]
	}, {
		type: "6up",
		title: ["What is your favorite shirt type?", "What is your second favorite shirt type?"],
		opts: ["Solid", "Plaid", "Striped"]
	}, {
		type: "3up",
		title: "What is your jean wash preference?",
		opts: ["Raw", "Washed", "I like both the same"]
	}, {
		type: "3up",
		title: "What is your T-Shirt preference?",
		opts: ["Fashion", "Graphic", "I like both the same"]
	}, {
		type: "final",
		title: "Get started. Create your account"
	}];

	var plugin = {
		init: function () {

		},
		start: function () {
			//console.log("Start Quiz");
			var $el = $(_.template($("#T_quiz").html(), {
				quiz: q
			}));

			$("#quizContent", $el).on('click', ".qt", function () {
				var val = $(this).data('value');
				var step = $(this).parents('.slide').data('step');
				var key = $(this).data('set');
				var part = parseInt($(this).data('part'), 10);
				var $parent = $(this).parents('.slide');

				$(".qt[data-part='" + part + "']").removeClass('selected');
				$(this).addClass('selected');

				//console.log("Click", step, val, q[step].title, q[step][key][val]);

				if (_(q[step].title).isArray()) {
					q[step].answer = q[step].answer || [];
					q[step].answerText = q[step].answerText || [];
					q[step].answer[part] = val;
					q[step].answerText[part] = q[step][key][val];
					if (q[step].answer.length === q[step].title.length) {
						$("#quizContent").slickNext();
					}
				} else {
					q[step].answer = val;
					q[step].answerText = [q[step][key][val]];
					$("#quizContent").slickNext();
				}


			});

			$("#quizContent", $el).on('click', "a.finalExit", plugin.destroy);
			$el.on('click', plugin.destroy);
			$("a.close", $el).on('click', plugin.destroy);
			$("#quiz", $el).on('click', function (e) {
				e.stopPropagation();
			});

			$("a.signup", $el).on('click', plugin.signup);

			$("body").append($el);

			$("#quizContent").slick({
				dots: true,
				arrows: false,
				touchMove: false,
				swipe: false
			});


		},
		serializeAnswers: function () {
			return _(q).map(function (v) {
				if (!v.answer) {
					return undefined;
				}
				return {
					answer: v.answer,
					answerText: v.answerText.join(),
					questionText: (_(v.title).isArray() ? v.title.join() : v.title)
				};
			});
		},

		signup: function () {
			console.log("Signup, debug, open checkout");
			App.fn.checkout.start();
			plugin.destroy();
		},

		destroy: function () {
			//console.log('destroy');
			//console.log(plugin.serializeAnswers());
			$("#quizBackdrop").remove();
		}
	};

	return plugin;

})(window, jQuery));