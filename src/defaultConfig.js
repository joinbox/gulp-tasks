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
			source: 'js',
			watch: '**/*.js?(x)',
			destination: 'js',
			entries: ['main.js'],
			output: '[name].js',
		}
	},
	// Use false to not expose styles task
	styles: {
		paths: {
			source: 'css',
			destination: 'css',
			watch: '**/*.scss',
			entries: ['main.scss'],
		}
	},
	// Use false to not template scripts	
	templates: {
		paths: {
			source: 'html',
			watch: '**/*.html',
			destination: 'html',
			entries: ['**/*.html'],
		},
	},
	production: {
		bustCache: false, // TBD
	},
	// False to not add it to tasks
	server: {
		paths: {
			source: 'html',
			watch: '**/*.html',
			start: 'html' // Where to point to
		}
	},
	// Browser applies to CSS prefixing and JS babel compilation, see 
	// https://github.com/browserslist/browserslist#queries
	supportedBrowsers: [
		'last 2 versions',
	],
};

module.exports = defaults;
