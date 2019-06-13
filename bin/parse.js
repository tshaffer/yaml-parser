module.exports = function (args) {
  console.log('parse.js, args:');
  console.log(args);
  if (args._[0] === 'parseYaml') {
    console.log('bin/parse.js invoked');
  }
}
