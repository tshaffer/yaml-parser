import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

import {
  BsBmapEnum,
  BsBmapFunction,
  BsBmapFunctionBlock,
  BsBmapEnumOption,
  YamlBmapEnum,
  YamlBmapFunction,
  YamlBmapFunctionBlock,
  YamlBmapEnumOption,
  BmapEnum,
  BmapFunction,
  BmapFunctionBlock,
  BmapEnumOption,
  YamlBmapOperator,
  BsBmapOperator,
} from './types';
import { isArray, isNil, isObject } from 'lodash';

const functionBlocks: YamlBmapFunctionBlock[] = [];
const bsFunctionBlocks: BsBmapFunctionBlock[] = [];

let yamlInputDirectory: string;
let bmapOutputDirectory: string;
let bmapIncludesSpecPath: string;

export function parseYaml(
  yaml_input_directory: string,
  bmap_output_directory: string,
  bmap_includes_spec_path: string) {

  // console.log('parseYaml invoked in typescript file');

  debugger;

  yamlInputDirectory = yaml_input_directory;
  bmapOutputDirectory = bmap_output_directory;
  bmapIncludesSpecPath = bmap_includes_spec_path;

  const includesSpec: any = parseBmapIncludesSpec();

  const bmapYamlData: any = safeLoad(fs.readFileSync(yamlInputDirectory + '/headers/BMAP.yaml', 'utf8'));

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    if (includesSpec.functionBlocks.hasOwnProperty(functionBlock.Name)) {
      const bsFunctionBlock: BsBmapFunctionBlock = objectKeysToLowerCase(functionBlock);
      bsFunctionBlock.functions = [];
      bsFunctionBlock.enums = [];
      getFunctions(bsFunctionBlock);
      bsFunctionBlocks.push(bsFunctionBlock);
    }
  }

  // Top level enums
  const topLevelBmapEnums: BsBmapEnum[] = [];

  for (let i = 1; i < bmapYamlData.Enums.length; i++) {
    const enumDefinition = bmapYamlData.Enums[i];
    const enumName = enumDefinition.Name;
    const enumDescription = enumDefinition.Description;
    const enumOptions = enumDefinition.Options;

    const bsBmapEnumOptions: BsBmapEnumOption[] = [];

    for (const enumOption of enumOptions) {
      const bmapEnumOption: BsBmapEnumOption = {
        name: enumOption.Name,
        description: enumOption.Description,
        value: enumOption.Value,
      };
      bsBmapEnumOptions.push(bmapEnumOption);
    }

    const bmapEnum: BsBmapEnum = {
      name: enumName,
      description: enumDescription,
      options: bsBmapEnumOptions
    };
    topLevelBmapEnums.push(bmapEnum);
  }

  const bmap: any = {};
  bmap.name = 'BMAP';
  bmap.version = '0.0.1';
  bmap.type = 'BMAP';
  bmap.functionBlocks = bsFunctionBlocks;
  bmap.enums = topLevelBmapEnums;
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
    functionBlock.name = bmapFunctionBlock.Name;
    functionBlock.functions = {};
    for (const bmapFunction of bmapFunctionBlock.Functions) {
      functionBlock.functions[bmapFunction.Name] = bmapFunction;
    }
    includesSpec.functionBlocks[bmapFunctionBlock.Name] = functionBlock;
  }

  return includesSpec;
}

function getFunctions(bsFunctionBlock: BsBmapFunctionBlock) {

  console.log('\n');
  console.log('Function block: ' + bsFunctionBlock.name);

  const path = yamlInputDirectory + '/' + bsFunctionBlock.name + '/' + bsFunctionBlock.name + '.yaml';
  console.log('path: ' + path);
  const functionYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));

  if (bsFunctionBlock.name === 'Experimental') {
    console.log('found it');
  }

  if (isObject(functionYamlData) && isArray(functionYamlData.Enums)) {

    // First entry in Enums array are the functions
    const functionsYaml: YamlBmapFunction[] = functionYamlData.Enums[0].Options;
    console.log('function count: ' + functionsYaml.length);
    for (const yamlBmapFunction of functionsYaml) {
      yamlBmapFunction.Operators = [];
      const bsBmapFunction: BsBmapFunction = objectKeysToLowerCase(yamlBmapFunction);
      bsFunctionBlock.functions.push(bsBmapFunction);
      getOperators(bsFunctionBlock, bsBmapFunction);
    }

    // Remaining entries in the Enums array are the actual enums
    for (let i = 1; i < functionYamlData.Enums.length; i++) {
      const enumDefinition = functionYamlData.Enums[i];
      const enumName = enumDefinition.Name;
      const enumDescription = enumDefinition.Description;
      const enumOptions = enumDefinition.Options;

      const bsBmapEnumOptions: BsBmapEnumOption[] = [];

      for (const enumOption of enumOptions) {
        const bsBmapEnumOption: BsBmapEnumOption = {
          name: enumOption.Name,
          description: enumOption.Description,
          value: enumOption.Value,
        };
        bsBmapEnumOptions.push(bsBmapEnumOption);
      }

      const bsBmapEnum: BsBmapEnum = {
        name: enumName,
        description: enumDescription,
        options: bsBmapEnumOptions
      };
      bsFunctionBlock.enums.push(bsBmapEnum);
    }
  }
}

function getOperators(bsBmapFunctionBlock: BsBmapFunctionBlock, bsBmapFunction: BsBmapFunction) {

  const path = yamlInputDirectory + '/' + bsBmapFunctionBlock.name + '/' + bsBmapFunction.name + '.yaml';
  console.log(path);

  if (bsBmapFunction.name == 'GestureRecognition') {
    console.log('found');
  }
  if (bsBmapFunction.name === 'OneRecord') {
    console.log('onerecord');
  }

  try {
    console.log('safeLoad directory: ' + path);
    const operatorYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
    if (isObject(operatorYamlData) && isObject(operatorYamlData.Messages)) {
      const bmapOperators: YamlBmapOperator[] = operatorYamlData.Messages;
      for (const yamlBmapOperator of bmapOperators) {
        const bsBmapOperator: BsBmapOperator = objectKeysToLowerCase(yamlBmapOperator);
        bsBmapFunction.operators.push(bsBmapOperator);
      }
    }

    bsBmapFunction.enums = [];
    if (isObject(operatorYamlData) && isArray(operatorYamlData.Enums)) {
      debugger;
      for (const enumDefinition of operatorYamlData.Enums) {
        const enumName = enumDefinition.Name;
        const enumDescription = enumDefinition.Description;
        const enumOptions = enumDefinition.Options;

        const bsBmapEnumOptions: BsBmapEnumOption[] = [];

        for (const enumOption of enumOptions) {
          const bmapEnumOption: BsBmapEnumOption = {
            name: enumOption.Name,
            description: enumOption.Description,
            value: enumOption.Value,
          };
          bsBmapEnumOptions.push(bmapEnumOption);
        }

        const bmapEnum: BsBmapEnum = {
          name: enumName,
          description: enumDescription,
          options: bsBmapEnumOptions
        };

        bsBmapFunction.enums.push(bmapEnum);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const objectKeysToLowerCase = (origObj: any) => {
  return Object.keys(origObj).reduce((newObj: any, key: string) => {
    const val = origObj[key];
    let newVal: any;
    if (isArray(val) && val.length === 0) {
      newVal = [];
    } else if (isNil(val)) {
      newVal = null;
    } else if (val !== null && val !== undefined) {
      newVal = (typeof val === 'object') ? objectKeysToLowerCase(val) : val;
    }
    const newKey: string = key.charAt(0).toLowerCase() + key.substring(1);
    newObj[newKey] = newVal;
    return newObj;
  }, {});
};
