'use strict';

const generators = require('yeoman-generator');

module.exports = generators.Base.extend(
{
    initializing: function() {},

    prompting: function()
    {
        let defaultAppName = this.fs.readJSON(this.destinationPath('package.json'), {}).name;
        if(defaultAppName)
        {
            defaultAppName = defaultAppName.replace(/^.*?\//, '');
        }
        if(!defaultAppName)
        {
            defaultAppName = this.appname;
        }

        return this.prompt(
        [
            {
                type: 'input',
                name: 'moduleName',
                message: 'Your project\'s module name',
                'default': defaultAppName, // Default to current folder name
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description of your project',
            },
            {
                type: 'input',
                name: 'githubOrg',
                message: 'Which github Organization should we use?',
                'default': 'hughescr',
            },
        ])
        .then(answers =>
        {
            this.config.set(answers);
            return this.prompt(
            [
                {
                    type: 'input',
                    name: 'npmOrg',
                    message: 'Which NPM Organization should we use?',
                    'default': this.config.get('githubOrg'),
                },
            ])
            .then(this.config.set.bind(this.config));
        });
    },

    configuring: function() {},

    'default': function() {},

    writing: function()
    {
        this.fs.copy(
            this.templatePath('eslintignore'),
            this.destinationPath('.eslintignore')
        );

        this.fs.copyTpl(
            this.templatePath('eslintrc.js'),
            this.destinationPath('.eslintrc.js'),
            this.config.getAll()
        );

        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore')
        );

        this.fs.copy(
            this.templatePath('npmignore'),
            this.destinationPath('.npmignore')
        );

        this.fs.copy(
            this.templatePath('sublime-project'),
            this.destinationPath(`${this.config.get('moduleName')}.sublime-project`)
        );

        this.fs.copyTpl(
            this.templatePath('src/index.js'),
            this.destinationPath('src/index.js'),
            this.config.getAll()
        );

        this.fs.copy(
            this.templatePath('test/eslintrc.js'),
            this.destinationPath('test/.eslintrc.js')
        );

        this.fs.copyTpl(
            this.templatePath('test/index.js'),
            this.destinationPath('test/index.js'),
            this.config.getAll()
        );

        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            this.config.getAll()
        );

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            this.config.getAll()
        );

        this.fs.copy(
            this.templatePath('flowconfig'),
            this.destinationPath('.flowconfig')
        );

        this.fs.copy(
            this.templatePath('babelrc'),
            this.destinationPath('.babelrc')
        );


        if(!/require\('load-grunt-tasks'\)\(grunt\);/.test(this.gruntfile.toString()))
        {
            this.gruntfile.prependJavaScript("require('load-grunt-tasks')(grunt);");
        }

        this.gruntfile.insertConfig('clean', JSON.stringify(
        {
            options: { force: true },
            build: ['build/*'],
            coverage: ['coverage/*'],
        }));

        this.gruntfile.insertConfig('eslint', JSON.stringify(
        {
            options:
            {
                maxWarnings: 0,
            },
            lint: ['src', 'test'],
        }));

        this.gruntfile.insertConfig('mocha_istanbul', "\
        {\
            coverage:\
            {\
                src: 'test',\
                options:\
                {\
                    reportFormats: ['html'],\
                    root: 'src',\
                    coverageFolder: 'coverage',\
                    recursive: true,\
                    quiet: false,\
                    clearRequireCache: true,\
                    reporter: 'spec',\
                    slow: 1,\
                    timeout: 10000,\
                    scriptPath: require.resolve('isparta/bin/isparta'),\
                    nodeExec: require.resolve('.bin/babel-node'),\
                    mochaOptions: ['--compilers', 'js:babel-register'],\
                },\
            },\
        }");

        this.gruntfile.insertConfig('flow', JSON.stringify(
        {
            sources: {
                options: {
                    style: 'color',
                },
            },
        }));

        this.gruntfile.insertConfig('babel', JSON.stringify(
        {
            options:
            {
                presets: ['es2015'],
            },
            build:
            {
                files:
                {
                    'build/index.js' : 'src/index.js',
                },
            },
        }));

        this.gruntfile.registerTask('lint', 'eslint');
        this.gruntfile.registerTask('coverage', 'mocha_istanbul');
        this.gruntfile.registerTask('test', ['lint', 'flow', 'mocha_istanbul']);
        this.gruntfile.registerTask('build', ['clean', 'babel']);

        this.gruntfile.registerTask('default', 'test');
    },

    conflicts: function() {},

    install: function()
    {
        this.npmInstall(
            [
                '@hughescr/eslint-config-flow',
                'babel-cli',
                'babel-eslint',
                'babel-plugin-transform-flow-strip-types',
                'babel-preset-es2015',
                'chai',
                'chai-as-promised',
                'chai-datetime',
                'eslint',
                'eslint-plugin-flow-vars',
                'eslint-plugin-flowtype',
                'eslint-plugin-if-in-test',
                'eslint-plugin-promise',
                'eslint-plugin-should-promised',
                'grunt',
                'grunt-babel',
                'grunt-cli',
                'grunt-contrib-clean',
                'grunt-eslint',
                'grunt-flow',
                'grunt-mocha-istanbul',
                'grunt-mocha-test',
                'isparta',
                'load-grunt-tasks',
                'mocha',
            ],
            { saveDev: true }
        );

        this.npmInstall(
            [
                '@hughescr/logger',
                'es6-promisify',
                'moment-timezone',
                'nconf',
                'underscore',
            ],
            { save: true }
        );
    },

    end: function() {},
});
