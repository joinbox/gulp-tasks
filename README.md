# Intro

Re-usable [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0) tasks for Joinbox projects that provide
reasonable defaults for the following file types:
- [x] scripts 
- [x] styles
- [ ] images (TBD)
- [ ] clear dist directory (TBD)

All tasks support:
- BrowserSync
- notifications

Scripts support:
- inlining of imports/exports (via [rollup.js](https://rollupjs.org/))
- backwards compatibility (via [Babel](https://babeljs.io/), including object properties and private class fields) 
- minification (via [terser](https://terser.org/))
- automatically adds core-js polyfills when needed (via `useBuildIns: 'usage'`)
- source maps

Styles support:
- SASS conversion to CSS (via [node-sass](https://www.npmjs.com/package/node-sass))
- glob support for SASS imports
- auto prefixes
- source maps

# Usage

1. Install task and peer dependencies: `npm i -D @joinbox/build-task browser-sync gulp babel-eslint`
1. Copy the contents of the provided [gulpfile.js](gulpfile.js) to your project
1. Change import path: `{ buildJavaScript, buildStyles } = require('@joinbox/build-task')`
1. Modify paths where needed
1. Run `npx gulp` (for dev task) and `npx gulp live`


# Tests

- Run `npm test``
- If you run a test manually, make sure to use the `--serial` option as we are relying on the file
system for our tests


# Migrate from v0.x to v1.x
​
## gulpfile.js
* Copy `gulpfile` from [here](ttps://github.com/joinbox/build-task/blob/HEAD/gulpfile.js) or another project
* Update `proxy-url`
​
## package.json:
* Change `@joinbox/build-task to newest version 
* Remove `node-sass` and all other dependencies of the previous build task
* Replace 'scripts' with
    ```
    "scripts": {
        "start": "npx gulp",
        "build": "npx gulp live"
    },
    ```
​
### console
````
npm i --save-dev "postcss"
npm i --save-dev del
npm i --save-dev imagemin
npm i
npm start
```