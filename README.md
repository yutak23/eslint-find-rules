# eslint-find-new-rules

Use this for your own [ESLint](http://eslint.org/) [sharable configuration](http://eslint.org/docs/developer-guide/shareable-configs)
to identify built-in ESLint rules that you're not explicitly configuring.

[![Build Status](https://img.shields.io/travis/kentcdodds/eslint-find-new-rules.svg?style=flat-square)](https://travis-ci.org/kentcdodds/eslint-find-new-rules)
[![Code Coverage](https://img.shields.io/codecov/c/github/kentcdodds/eslint-find-new-rules.svg?style=flat-square)](https://codecov.io/github/kentcdodds/eslint-find-new-rules)
[![version](https://img.shields.io/npm/v/eslint-find-new-rules.svg?style=flat-square)](http://npm.im/eslint-find-new-rules)
[![downloads](https://img.shields.io/npm/dm/eslint-find-new-rules.svg?style=flat-square)](http://npm-stat.com/charts.html?package=eslint-find-new-rules&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/eslint-find-new-rules.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Usage

The intended usage is as an npm script:

```javascript
{
  ...
  "scripts": {
    "find-new-rules": "eslint-find-new-rules eslint-config-yourconfigname"
  }
  ...
}
```

Then run it with: `$ npm run find-new-rules -s` (the `-s` is to silence npm output).

### Specify a file

This is really handy in an actual config module (like [mine](https://github.com/kentcdodds/eslint-config-kentcdodds)) where you could also do:

```
eslint-find-new-rules ./index.js
```

This is resolved relative to the `process.cwd()` which, in the context of npm scripts is always the location of you `package.json`.

### Absolute Path

You can also provide an absolute path:

```
eslint-find-new-rules ~/Developer/eslint-config-kentcdodds/index.js
```

### Default to `main`

It will also default to the `main` in your `package.json`, so you can omit the argument altogether:

```
eslint-find-new-rules
```

## LICENSE

MIT

