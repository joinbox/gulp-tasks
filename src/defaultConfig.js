const defaults = {
	// For sub-paths, use arrays!
	paths: { 
		base: 'www',
		source: 'src',
		destination: 'dest',
		public: '', // Directory to serve files from
	},
	// Use false to not expose scripts task
	scripts: { 
		// use ['default'] or ['react'] (not both, react includes default)
		technologies: ['default'], 
		paths: {
			base: 'js',
			entries: ['main.js'],
			output: '[name].js',
		}
	},
	// Use false to not expose styles task
	styles: {
		paths: {
			base: 'css',
			entries: ['main.scss'],
		}
	},
	// Use false to not template scripts	
	templates: {
		paths: {
			base: 'html',
			entries: '**/*.html',
		},
	},
	development: {

	}, 
	production: {
		bustCache: false, // TBD
	},
	server: {
	},
	// Browser applies to CSS prefixing and JS babel compilation, see 
	// https://github.com/browserslist/browserslist#queries
	supportedBrowsers: [
		'last 2 versions',
	],
};

module.exports = defaults;
