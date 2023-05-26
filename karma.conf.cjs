module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-coverage'],

    // Configuração do plugin de cobertura (coverage)
    coverageReporter: {
      type: 'text', // Exibe a cobertura no terminal
      dir: 'coverage/', // Pasta de saída para os relatórios de cobertura
      reporters: [
        { type: 'html', dir: 'coverage/' }, // Gera o relatório HTML
        { type: 'text' }, // Exibe a cobertura no terminal
      ],
    },

    // list of files / patterns to load in the browser
    files: [],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      // Configuração para os arquivos de código-fonte
      'src/**/*.js': ['coverage'],
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome', 'ChromeHeadlessNoSandbox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,
  });
};
