Overview
========

This is a scaffold for the basic structure of a NodeJS package for Craig's use

Use
===

Install yo and the generator (probably globally), create a directory for your project, then run the generator in that directory

```
npm -g install yo @hughescr/generator-node-basic
mkdir sample-project
cd sample-project
yo @hughescr/node-basic
```

Answer the questions for the config you want, then sit back and it'll build and set up:

* Main source stub
* Unit test stubs
* ESLint
* Gulp, including
  - `lint` target which runs lint
  - `mocha` target which runs the unit tests
  - `test` target which runs lint & tests
* NPM package.json, including
  - `postversion` script which handles git updating of version ticking
