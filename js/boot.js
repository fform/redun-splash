if (!window.console) {
	try {
		window.console = {
			log: function () {},
			warn: function () {},
			error: function () {}
		};
	} catch (e) {}
}
var App = window.App = {
	"env": "",
	"currentPage": "",
	"baseurl": "",
	"DEV": "development",
	"STAGE": "staging",
	"PROD": "production",
	fn: {},
	"extend": function (id, cb) {
		if (App.fn.hasOwnProperty(id)) {
			App.error(id, "Overwrite namespace");
			return;
		}
		App.fn[id] = cb;
	},
	"init": function (env) {
		App.env = env || App.DEV;
		if (!window.location.origin)
			window.location.origin = window.location.protocol + "//" + window.location.host;
		App.baseurl = window.location.origin;
		App.currentPage = String(document.location.pathname);

		$(App.ready);

	},
	"ready": function () {
		for (var i in App.fn) {
			if (App.fn[i] && App.fn[i].hasOwnProperty('init') && typeof App.fn[i].init === "function") {
				App.fn[i].init();
			}
			if (App.fn[i] && App.fn[i].hasOwnProperty('page') && App.fn[i].hasOwnProperty('match') && typeof App.fn[i].page === "function" && App.fn[i].match.test(App.currentPage)) {
				App.fn[i].page();
			}
		}
	},
	"base": function (append) {
		return App.baseurl + (append || "");
	},
	"log": function () {
		if (App.env === App.DEV) {
			console.log.apply(console, arguments);
		}
	},
	"error": function () {
		if (App.env === App.DEV) {
			console.error.apply(console, arguments);
		}
	},
	"page": function (id) {
		App.currentPage = id;
	}
};