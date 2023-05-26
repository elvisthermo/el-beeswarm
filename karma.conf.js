module.exports = function (config) {
  config.set({
    // Lista de arquivos/padrões a serem carregados no navegador
    files: [
      './index.js', // Seus arquivos JavaScript de origem
      './index.spec.js', // Seus arquivos de teste Jasmine
    ],

    // Frameworks a serem usados
    frameworks: ['jasmine'],

    // Navegadores a serem usados
    browsers: ['Chrome'], // Você pode adicionar outros navegadores aqui

    plugins: [
      // ... outros plugins
      'karma-chrome-launcher',
    ],

    // Configuração dos relatórios de saída
    reporters: ['progress'],

    // Configuração dos preprocessadores, se necessário
    preprocessors: {
      './index.js': ['coverage'], // Opcional: configuração de cobertura de código
    },
  });
};

//   npx karma start karma.conf.js
