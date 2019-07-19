const yamlParser = require('../dist/yaml-parser');
const parseYaml = yamlParser.parseYaml;

module.exports = function (args) {

  console.log('yamlParser');
  console.log(yamlParser);

  console.log('parse.js, args:');
  console.log(args);
  
  if (args._[0] === 'parseYaml') {
    console.log('bin/parse.js invoked');

    parseYaml(
      args.yamlInputDirectory, 
      args.bmapOutputDirectory,
      args.bmapIncludesSpecPath
      );
  }

}
