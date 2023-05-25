import sonarqubeScanner from "sonarqube-scanner";

sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    options: {
      "sonar.sources": "src",
      "sonar.exclusions": "src/**.spec.ts, coverager", 
      'sonar.tests': 'src',
      'sonar.test.inclusions':  'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
            'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
    },
  },
  () => process.exit()
);
