import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

import {
  BmapEnum,
  BmapFunction,
  BmapFunctionBlock,
  BmapEnumOption
} from './types';
import { cloneDeep, isArray, isObject } from 'lodash';

const functionBlocks: BmapFunctionBlock[] = [];
const updatedFunctionBlocks: BmapFunctionBlock[] = [];

let yamlInputDirectory: string;
let bmapOutputDirectory: string;
let bmapIncludesSpecPath: string;

export function parseYaml(
  yaml_input_directory: string,
  bmap_output_directory: string,
  bmap_includes_spec_path: string) {

  // console.log('parseYaml invoked in typescript file');

  yamlInputDirectory = yaml_input_directory;
  bmapOutputDirectory = bmap_output_directory;
  bmapIncludesSpecPath = bmap_includes_spec_path;

  const includesSpec: any = parseBmapIncludesSpec();

  const bmapYamlData: any = safeLoad(fs.readFileSync(yamlInputDirectory + '/headers/BMAP.yaml', 'utf8'));

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    if (includesSpec.functionBlocks.hasOwnProperty((functionBlock as any).Name)) {
      const updatedFunctionBlock: any = objectKeysToLowerCase(functionBlock);
      updatedFunctionBlocks.push(updatedFunctionBlock);
    }
  }

  debugger;

  for (const functionBlock of updatedFunctionBlocks) {
    functionBlock.functions = [];
    functionBlock.enums = [];
    getFunctions(functionBlock);
    if (functionBlock.functions.length > 0) {
      functionBlocks.push(functionBlock);
    }
  }

  debugger;

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    if (includesSpec.functionBlocks.hasOwnProperty(functionBlock.name)) {
      functionBlock.Functions = [];
      functionBlock.Enums = [];
      getFunctions(functionBlock);
      if (functionBlock.Functions.length > 0) {
        functionBlocks.push(functionBlock);
      }
    }
  }

  // Top level enums
  let topLevelBmapEnums: BmapEnum[] = [];

  for (let i = 1; i < bmapYamlData.Enums.length; i++) {
    const enumDefinition = bmapYamlData.Enums[i];
    const enumName = enumDefinition.name;
    const enumDescription = enumDefinition.Description;
    const enumOptions = enumDefinition.Options;

    const bmapEnumOptions: BmapEnumOption[] = [];

    for (const enumOption of enumOptions) {
      const bmapEnumOption: BmapEnumOption = {
        Name: enumOption.name,
        Description: enumOption.Description,
        Value: enumOption.Value,
      };
      bmapEnumOptions.push(bmapEnumOption);
    }

    const bmapEnum: BmapEnum = {
      Name: enumName,
      Description: enumDescription,
      Options: bmapEnumOptions
    };
    topLevelBmapEnums.push(bmapEnum);
  }

  const bmap: any = {};
  bmap.name = 'BMAP';
  bmap.Version = '0.0.1';
  bmap.Type = 'BMAP';
  bmap.FunctionBlocks = functionBlocks;
  bmap.Enums = topLevelBmapEnums;
  const bmapJson: string = JSON.stringify(bmap, null, 2);
  fs.writeFileSync(bmapOutputDirectory + '/bmap.json', bmapJson);
}

function parseBmapIncludesSpec(): any {
  const bmapIncludesSpecStr: string = fs.readFileSync(bmapIncludesSpecPath, 'utf8');
  const bmapIncludesSpec: any = JSON.parse(bmapIncludesSpecStr);

  const includesSpec: any = {};
  includesSpec.functionBlocks = {};

  for (const bmapFunctionBlock of bmapIncludesSpec.FunctionBlocks) {
    const functionBlock: any = {};
    functionBlock.name = bmapFunctionBlock.name;
    functionBlock.functions = {};
    for (const bmapFunction of bmapFunctionBlock.Functions) {
      functionBlock.functions[bmapFunction.name] = bmapFunction;
    }
    includesSpec.functionBlocks[bmapFunctionBlock.name] = functionBlock;
  }

  return includesSpec;
}

function getFunctions(functionBlock: BmapFunctionBlock) {

  console.log('\n');
  console.log('Function block: ' + functionBlock.name);

  const path = yamlInputDirectory + '/' + functionBlock.name + '/' + functionBlock.name + '.yaml';
  console.log('path: ' + path);
  const functionYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));

  if (functionBlock.name === 'Experimental') {
    console.log('found it');
  }

  if (isObject(functionYamlData) && isArray(functionYamlData.Enums)) {

    // First entry in Enums array are the functions
    const functionsYaml = functionYamlData.Enums[0].Options;
    console.log('function count: ' + functionsYaml.length);
    for (const bmapFunction of functionsYaml) {
      bmapFunction.Operators = [];
      functionBlock.functions.push(bmapFunction as BmapFunction);
      getOperators(functionBlock, bmapFunction);
    }

    // Remaining entries in the Enums array are the actual enums
    for (let i = 1; i < functionYamlData.Enums.length; i++) {
      const enumDefinition = functionYamlData.Enums[i];
      const enumName = enumDefinition.name;
      const enumDescription = enumDefinition.Description;
      const enumOptions = enumDefinition.Options;

      const bmapEnumOptions: BmapEnumOption[] = [];

      for (const enumOption of enumOptions) {
        const bmapEnumOption: BmapEnumOption = {
          Name: enumOption.name,
          Description: enumOption.Description,
          Value: enumOption.Value,
        };
        bmapEnumOptions.push(bmapEnumOption);
      }

      const bmapEnum: BmapEnum = {
        Name: enumName,
        Description: enumDescription,
        Options: bmapEnumOptions
      };
      functionBlock.enums.push(bmapEnum);
    }
  }
}

function getOperators(bmapFunctionBlock: BmapFunctionBlock, bmapFunction: BmapFunction) {

  const path = yamlInputDirectory + '/' + bmapFunctionBlock.name + '/' + bmapFunction.name + '.yaml';
  console.log(path);

  if (bmapFunction.name == 'GestureRecognition') {
    console.log('found');
  }
  if (bmapFunction.name === 'OneRecord') {
    console.log('onerecord');
  }

  try {
    console.log('safeLoad directory: ' + path);
    const operatorYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
    if (isObject(operatorYamlData) && isObject(operatorYamlData.Messages)) {
      const bmapOperators: any[] = operatorYamlData.Messages;
      for (const bmapOperator of bmapOperators) {
        bmapFunction.Operators.push(bmapOperator);
      }
    }

    bmapFunction.Enums = [];
    if (isObject(operatorYamlData) && isArray(operatorYamlData.Enums)) {
      for (const enumDefinition of operatorYamlData.Enums) {
        const enumName = enumDefinition.name;
        const enumDescription = enumDefinition.Description;
        const enumOptions = enumDefinition.Options;

        const bmapEnumOptions: BmapEnumOption[] = [];

        for (const enumOption of enumOptions) {
          const bmapEnumOption: BmapEnumOption = {
            Name: enumOption.name,
            Description: enumOption.Description,
            Value: enumOption.Value,
          };
          bmapEnumOptions.push(bmapEnumOption);
        }

        const bmapEnum: BmapEnum = {
          Name: enumName,
          Description: enumDescription,
          Options: bmapEnumOptions
        };

        bmapFunction.Enums.push(bmapEnum);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const objectKeysToLowerCase = (origObj: any) => {
  return Object.keys(origObj).reduce((newObj: any, key: string) => {
    const val = origObj[key];
    const newVal = (typeof val === 'object') ? objectKeysToLowerCase(val) : val;
    const newKey: string = key.charAt(0).toLowerCase() + key.substring(1); 
    newObj[newKey] = newVal;
    return newObj;
  }, {});
};
