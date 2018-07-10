'use strict';

const Generator = require('yeoman-generator');


const validators = {
    validatepackageName: packageName => packageName.length > 0,
    validatepackageDesc: packageDesc => packageDesc.length > 0,
    validateFullName: fullName => fullName.length > 0,
    validatePypiUserName: pypiUserName => pypiUserName.length > 0,
    validateEmail: email => email.length > 0,
    validateGithubUserName: githubUserName => githubUserName.length > 0,
  };


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('packageName',
      {
        defaults: this.config.get('packageName'),
        desc: 'Name of your project.',
        type: String,
      });

    this.option('packageDesc',
      {
        defaults: this.config.get('packageDesc'),
        desc: 'Description of your project.',
        type: String,
      });

    this.option('fullName',
      {
        defaults: this.config.get('fullName'),
        desc: 'Your full name.',
        type: String,
      }
    );

    this.option('githubUserName',
      {
        defaults: this.config.get('githubUserName'),
        desc: 'Your github username.',
        type: String,
      }
    );

    this.option('pypiUserName',
      {
        defaults: this.config.get('pypiUserName'),
        desc: 'Your PyPi username.',
        type: String,
      }
    );

    this.option('email',
      {
        defaults: this.config.get('email'),
        desc: 'Your e-mail address.',
        type: String,
      });

    this.option('useTravisCI',
      {
        defaults: this.config.get('useTravisCI') || 0,
        desc: 'Create a travis.yml file.',
        type: Boolean,
      });
  }

  initializing() {
    this.pkg = require('../../package.json');

    const updateNotifier = require('update-notifier');

    updateNotifier({pkg: this.pkg}).notify();
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')(
        'Welcome to the python 3.6+ package generator!'
      ));
    }

    const prompts = [
      {
        default: this.options.packageName,
        message: 'Name of your project',
        name: 'packageName',
        type: 'input',
        validate: validators.validatepackageName,
      },
      {
        default: this.options.packageName,
        message: 'Description of your project',
        name: 'packageDesc',
        type: 'input',
        validate: validators.validatepackageDesc,
      },
      {
        default: this.options.fullName,
        message: 'Your full name',
        name: 'fullName',
        type: 'input',
        validate: validators.validateFullName,
      },
      {
        default: this.options.pypiUserName,
        message: 'Your PyPi username',
        name: 'pypiUserName',
        type: 'input',
        validate: validators.validatePypiUserName,
      },
      {
        default: this.options.githubUserName,
        message: 'The github account name',
        name: 'githubUserName',
        type: 'input',
        validate: validators.validateGithubUserName,
      },
      {
        default: this.options.email,
        message: 'Your e-mail address',
        name: 'email',
        type: 'input',
        validate: validators.validateEmail,
      },
      {
        default: this.options.useTravisCI,
        message: 'Use TravisCI or not',
        name: 'useTravisCI',
        type: 'boolean',
      },
    ];

    return this.prompt(prompts).then(answers => {
      this.packageName = answers.packageName;
      this.config.set('packageName', this.packageName);

      this.packageDesc = answers.packageDesc;
      this.config.set('packageDesc', this.packageDesc);

      this.fullName = answers.fullName;
      this.config.set('fullName', this.fullName);

      this.pypiUserName = answers.pypiUserName;
      this.config.set('pypiUserName', this.pypiUserName);

      this.githubUserName = answers.githubUserName;
      this.config.set('githubUserName', this.githubUserName);

      this.email = answers.email;
      this.config.set('email', this.email);

      this.useTravisCI = answers.useTravisCI;
      this.config.set('useTravisCI', this.useTravisCI);
    });
  }

  writing() {
    const cp = (from, to) => {
      this.fs.copy(this.templatePath(from), this.destinationPath(to));
    };

    this.composeWith(require.resolve('generator-license'), {
      name: this.fullName,
      email: this.email,
    });

    this.fs.copyTpl(
      this.templatePath('_setup.py'),
      this.destinationPath('setup.py'),
      {
        email: this.email,
        fullName: this.fullName,
        packageName: this.packageName,
        packageDesc: this.packageDesc,
      }
    );

    if (this.useTravisCI) {
      this.fs.copyTpl(
        this.templatePath('.travis.yml'),
        this.destinationPath('.travis.yml'),
        {
          pypiUserName: this.pypiUserName,
        }
      );
    }

    this.fs.write(
      this.destinationPath(this.packageName + '/__init__.py'),
      '',
    );

    this.fs.write(
      this.destinationPath(this.packageName + '/tests/__init__.py'),
      '',
    );

    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      {
        useTravisCI: this.useTravisCI,
        fullName: this.fullName,
        packageName: this.packageName,
        githubUserName: this.githubUserName,
      }
    );

    cp('.flake8', '.flake8');
    cp('_Makefile', 'Makefile');
    cp('.editorconfig', '.editorconfig');
    cp('.gitignore', '.gitignore');
    cp('_requirements.txt', 'requirements.txt');

    this.config.set('version', this.pkg.version);
  }
};
