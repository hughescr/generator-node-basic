'use strict';

const generators = require('yeoman-generator');

module.exports = generators.Base.extend(
{
    initializing: function() {},

    prompting: function()
    {
        return this.prompt(
        [
            {
                type: 'input',
                name: 'moduleName',
                message: 'Your project\'s module name',
                default: this.appname, // Default to current folder name
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description of your project',
            },
            {
                type: 'confirm',
                name: 'logger',
                message: 'Would you like to include @hughescr/logger support?',
                default: true,
            },
            {
                type: 'input',
                name: 'githubOrg',
                message: 'Which github Organization should we use?',
                default: 'hughescr',
            },
        ])
        .then(function(answers)
        {
            this.config.set(answers);
            return this.prompt(
            [
                {
                    type: 'input',
                    name: 'npmOrg',
                    message: 'Which NPM Organization should we use?',
                    default: this.config.get('githubOrg'),
                }
            ])
            .then(function(answers)
            {
                this.config.set(answers);
            }.bind(this));
        }.bind(this))
    },

    configuring: function() {},

    default: function() {},

    writing: function()
    {
        this.fs.copy(
            this.templatePath('.eslintignore'),
            this.destinationPath('.eslintignore')
        );

        this.fs.copy(
            this.templatePath('.eslintrc.js'),
            this.destinationPath('.eslintrc.js')
        );

        this.fs.copy(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore')
        );

        this.fs.copy(
            this.templatePath('.sublime-project'),
            this.destinationPath(`${this.config.get('moduleName')}.sublime-project`)
        );

        this.fs.copy(
            this.templatePath('src/index.js'),
            this.destinationPath('src/index.js')
        );

        this.fs.copy(
            this.templatePath('test/.eslintrc.js'),
            this.destinationPath('test/.eslintrc.js')
        );

        this.fs.copy(
            this.templatePath('test/index.js'),
            this.destinationPath('test/index.js')
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


        this.gruntfile.prependJavaScript("require('load-grunt-tasks')(grunt);");

        this.gruntfile.loadNpmTasks([
            'grunt-mocha-test',
            'grunt-mocha-istanbul',
            'grunt-contrib-clean',
        ]);

        this.gruntfile.insertConfig('clean', JSON.stringify(
        [
            'coverage/'
        ]));

        this.gruntfile.insertConfig('eslint', JSON.stringify(
        {
            options:
            {
                maxWarnings: 0,
            },
            lint: ['.'],
        }));

        this.gruntfile.insertConfig('mochaTest', JSON.stringify(
        {
            test:
            {
                options:
                {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false,
                },
                src: ['test/**/*.js'],
            }
        }));

        this.gruntfile.registerTask('lint', 'eslint');
        this.gruntfile.registerTask('mocha', 'mochaTest');
        this.gruntfile.registerTask('test', ['lint', 'mocha']);
    },

    conflicts: function() {},

    install: function()
    {
        this.npmInstall(
            [
                'eslint',
                'eslint-plugin-promise',
                'eslint-plugin-if-in-test',
                'eslint-plugin-should-promised',
                '@hughescr/eslint-config-default',
                'grunt',
                'grunt-cli',
                'grunt-eslint',
                'grunt-contrib-clean',
                'grunt-mocha-istanbul',
                'grunt-mocha-test',
                'istanbul',
                'load-grunt-tasks',
                'mocha',
                'chai',
                'chai-as-promised',
                'chai-datetime',
            ],
            { saveDev: true }
        );

        this.npmInstall(
            [
                '@hughescr/logger',
                'es6-promisify',
                'moment-timezone',
                'underscore',
            ],
            { save: true }
        );
    },

    end: function() {},
});