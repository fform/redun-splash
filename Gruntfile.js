var fs = require('fs');
//Grunt Configuration
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			images: [
				'public/assets/img'
			],
			code: [
				'public/assets/css',
				'public/assets/js'
			]
		},

		sprite: {
			all: {
				src: 'images/icons/**/*.{png,jpg,gif}',
				destImg: 'public/assets/img/icons.png',
				destCSS: 'scss/_sprites.scss',
				imgPath: '../img/icons.png',
				padding: 10,
				//cssTemplate: cssTemplateFn
			}
		},

		sass: {
			options: {
				includePaths: [
					'scss/',
					//'bower_components/foundation/scss',
					require('node-bourbon').includePaths
				],
				imagePath: "../img/"
			},
			dist: {
				options: {
					outputStyle: 'compressed',
					//sourceComments: 'map'
				},
				files: {
					'public/assets/css/app.css': 'scss/app.scss'
				}
			}
		},

		copy: {
			/*
			vendor: {
				files: [{
					expand: true,
					cwd: 'bower_components/slick-carousel/slick/',
					src: ['fonts/**'],
					dest: 'public/assets/'
				}]
			}
			*/
		},

		uglify: {

			vendor: {
				options: {
					//sourceMap: true,
				},
				files: [{
					'public/assets/js/vendor.js': [
						'bower_components/jquery/dist/jquery.min.js',
						'bower_components/jquery.cookie/jquery.cookie.js',
						'bower_components/jquery-placeholder/jquery.placeholder.min.js',

						//'bower_components/modernizr/modernizr.js',
						//'bower_components/underscore/underscore.js',
						'bower_components/fastclick/lib/fastclick.js',
						//'bower_components/slick-carousel/slick/slick.min.js',

						//'bower_components/foundation/js/foundation/foundation.js'
					]
				}]
			},

			frontend: {
				options: {
					sourceMap: true,
				},
				files: [{
					'public/assets/js/boot.min.js': 'js/boot.js'
				}, {
					'public/assets/js/front.min.js': 'js/front**/*.js'
				}]
			}
		},

		concat: {
			jstemplates: {
				options: {
					process: function (src, s) {
						return "<script type='text/html' id='T_" + s.substr(s.lastIndexOf('/') + 1).replace(/\..*/ig, '') + "'>\n" + src + "\n</script>";
					}
				},
				files: {
					"public/templates.html": "templates/js/**/*.html"
				}
			},
			dist: {
				options: {
					process: function (src, s) {
						var matches = src.match(/\{\{(.+?)\}\}/gi);
						for (var i in matches) {
							var str = matches[i];
							var filename = str.replace(/\{|\}/gi, '').replace(/^\s+|\s+$/g, '');
							var file = fs.readFileSync("./templates/" + filename);
							src = src.replace(str, file);
						}
						return src;
					}
				},
				files: [{
					"public/index.html": ["templates/partials/header.html", "templates/pages/home.html", "public/templates.html", "templates/partials/footer.html"]
				}]
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					dest: "public/assets/img/",
					cwd: "images",
					src: ["*.{png,jpg,gif}", "**/*.{png,jpg,gif}"]
				}]
			}
		},

		watch: {
			grunt: {
				files: ['Gruntfile.js'],
				tasks: ['all']
			},

			sass: {
				files: ['scss/**/*.scss', 'scss/*.scss'],
				tasks: ['sass']
			},

			js: {
				files: 'js/**/*.js',
				tasks: ['uglify:frontend']
			},

			html: {
				files: 'templates/**/*.html',
				tasks: ['concat']
			},

			images: {
				files: ['images/**/*.{png,jpg,gif}', 'images/*.{png,jpg,gif}'],
				tasks: ['clean:images', 'imagemin', 'sprite']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('images', ['clean:images', 'imagemin', 'sprite']);
	grunt.registerTask('code', ['clean:code', 'sass', 'uglify']);


	grunt.registerTask('all', ['images', 'code', 'watch']);

	grunt.registerTask('default', ['code', 'watch']);
};

// Helpers
var cssTemplateFn = function (p) {

	var sheet = "",
		subsheet = "",
		nl = "\n",
		tb = "\t";
	//console.log(p);
	sheet = [
		'@media',
		'only screen and (-webkit-min-device-pixel-ratio: 2),',
		'only screen and ( min--moz-device-pixel-ratio: 2),',
		'only screen and ( -o-min-device-pixel-ratio: 2/1),',
		'only screen and ( min-device-pixel-ratio: 2),',
		//'only screen and ( min-resolution: 192dpi),',
		'only screen and ( min-resolution: 2dppx)',
		'{',
		'.icons{',
		'display: block;',
		'background-image: url("' + p.items[0].image + '");',
		'background-size: ' + (p.items[0].total_width) + 'px ' + (p.items[0].total_height) + 'px;',
		'}',
		'} .icons{',
		'background-image: url("' + p.items[0].image + '");',
	].join(nl);

	for (var i in p.items) {
		//console.log('format', p.items[i]);
		var sprite = p.items[i];
		var sizes = calcsize(sprite);
		var name = sprite.name.replace(/\W/ig, '');
		var url = "url('" + sprite.image + "')";

		sheet += "&." + name + "{" + nl +
			tb + "width: " + sizes.width + ";" + nl +
			tb + "height: " + sizes.height + ";" + nl +
			tb + "background-position: " + sizes.x + " " + sizes.y + ";" + nl +
			"}" + nl;

		subsheet += "@mixin sprite-" + name + "(){" + nl +
			tb + "background-image: " + url + ";" + nl +
			tb + "background-repeat: no-repeat;" + nl +
			tb + "background-position: " + sizes.x + " " + sizes.y + ";" + nl +
			tb + "width: " + sizes.width + ";" + nl +
			tb + "height: " + sizes.height + ";" + nl +
			tb + "background-size: " + sizes.total_width + ' ' + sizes.total_height + ";" + nl +
			"}" + nl +
			"$" + name + "-image: " + url + ";" + nl +
			"$" + name + "-width: " + sizes.width + ";" + nl +
			"$" + name + "-height: " + sizes.height + ";" + nl +
			"$" + name + "-pos-x: " + sizes.x + ";" + nl +
			"$" + name + "-pos-y: " + sizes.y + ";" + nl +
			"";
	}
	sheet += "}";
	sheet += subsheet;
	return sheet;
};
var calcsize = function (s) {
	var is2x = (s.name.indexOf('@2x') !== -1);
	return {
		x: (is2x ? s.offset_x / 2 : s.offset_x) + 'px',
		y: (is2x ? s.offset_y / 2 : s.offset_y) + 'px',
		width: (is2x ? s.width / 2 : s.width) + 'px',
		height: (is2x ? s.height / 2 : s.height) + 'px',
		total_width: (is2x ? s.total_width / 2 : s.total_width) + 'px',
		total_height: (is2x ? s.total_height / 2 : s.total_height) + 'px'
	};
};