const yaml = require('js-yaml');
const fs = require('fs');

// Load BMAP.yaml
try {
  // Read the data from BMAP.yaml to an array:
  BmapYamlData = yaml.safeLoad(fs.readFileSync('BMAP.yaml', 'utf8'));
  console.log(BmapYamlData);

  var FBlocksYaml = BmapYamlData.Enums[0].Options;
  console.log('FBlocksYaml');
  console.log(FBlocksYaml);

  console.log('ProductInfo function block');
  console.log(BmapYamlData.Enums[0].Options[0].Name)
  console.log(BmapYamlData.Enums[0].Options[0])

  console.log('invoke getFBlocks');
  FBlockList = getFBlocks();
  console.log('display FBlockList');
  console.log(FBlockList);

} catch (e) {
  console.log(e);
}


function getFBlocks() {

  let BmapYamlData = {}; // Create an empty array to hold JSON data

  try {
    // Read the data from BMAP.yaml to our array:
    BmapYamlData = yaml.safeLoad(fs.readFileSync('./BMAP_YAML/headers/BMAP.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
  }

  var FBlocksYaml = BmapYamlData.Enums[0].Options;   // This contains everything inside of Options...
  var testOutput = "*** List of Function Blocks: " + "\n";

  var x;
  for (x in FBlocksYaml) {
    testOutput += FBlocksYaml[x].Name
    testOutput += "\n"
  }
  // Spit the whole thing out as a readable string:
  var FBlockList = testOutput.toString()

  return FBlockList
}

// This function expects a string indicating which FBlock to query, e.g. AudioManagement
function getFunctions(whichFBlock) {

  selectedFBlock = whichFBlock;

  // This is all working...
  let path = './BMAP_YAML/' + selectedFBlock + '/' + whichFBlock + '.yaml'
  let functionYamlData = {}

  try {
    functionYamlData = yaml.safeLoad(fs.readFileSync(path));
  } catch (e) {
    console.log(e);
  }

  var functionsYaml = functionYamlData.Enums[0].Options;
  var funcOutput = "\n\n" + "*** List of " + whichFBlock + " Functions: " + "\n";

  var x;
  for (x in functionsYaml) {
    funcOutput += functionsYaml[x].Name
    funcOutput += "\n"
  }
  // Spit the whole thing out as a readable string:
  var validFunctions = funcOutput.toString()

  return validFunctions

  // USAGE: getFunctions('AudioManagement')

}

function getOperators(whichFunc) {
  // This is a little sketchy: It depends on selectedFBlock having been set elsewhere...
  let path = './BMAP_YAML/' + selectedFBlock + '/' + whichFunc + '.yaml'
  let operatorYamlData = {};

  try {
    operatorYamlData = yaml.safeLoad(fs.readFileSync(path));
  } catch (e) {
    console.log(e);
  }

  operatorsYaml = operatorYamlData.Messages;
  var operatorOutput = "\n\n" + "*** List of " + whichFunc + " Operators: " + "\n";

  var x;
  for (x in operatorsYaml) {
    operatorOutput += operatorsYaml[x].Description
    operatorOutput += "\n"
  }
  return operatorOutput

}



