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
} from './types';
import { isArray, isObject } from 'lodash';

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

  yamlInputDirectory = yaml_input_directory;
  bmapOutputDirectory = bmap_output_directory;
  bmapIncludesSpecPath = bmap_includes_spec_path;

  const includesSpec: any = parseBmapIncludesSpec();

  const bmapYamlData: any = safeLoad(fs.readFileSync(yamlInputDirectory + '/headers/BMAP.yaml', 'utf8'));

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    if (includesSpec.functionBlocks.hasOwnProperty(functionBlock.Name)) {
      const bsFunctionBlock: BsBmapFunctionBlock = objectKeysToLowerCase(functionBlock);
      bsFunctionBlocks.push(bsFunctionBlock);
    }
  }

  for (const bsFunctionBlock of bsFunctionBlocks) {
    bsFunctionBlock.functions = [];
    bsFunctionBlock.enums = [];
    getFunctions(bsFunctionBlock);
    if (bsFunctionBlock.functions.length > 0) {
      bsFunctionBlocks.push(bsFunctionBlock);
    }
  }

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    if (includesSpec.functionBlocks.hasOwnProperty(functionBlock.Name)) {
      functionBlock.Functions = [];
      functionBlock.Enums = [];
      getFunctions(functionBlock);
      if (functionBlock.Functions.length > 0) {
        functionBlocks.push(functionBlock);
      }
    }
  }

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    if (includesSpec.functionBlocks.hasOwnProperty(functionBlock.Name)) {
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
    const enumName = enumDefinition.Name;
    const enumDescription = enumDefinition.Description;
    const enumOptions = enumDefinition.Options;

    const bmapEnumOptions: BmapEnumOption[] = [];

    for (const enumOption of enumOptions) {
      const bmapEnumOption: BmapEnumOption = {
        Name: enumOption.Name,
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
  bmap.Name = 'BMAP';
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

  debugger;

  console.log('\n');
  console.log('Function block: ' + bsFunctionBlock.name);

  const path = yamlInputDirectory + '/' + bsFunctionBlock.name + '/' + bsFunctionBlock.name + '.yaml';
  console.log('path: ' + path);
  const functionYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));

  if (bsFunctionBlock.name === 'Experimental') {
    console.log('found it');
  }

  debugger;

  if (isObject(functionYamlData) && isArray(functionYamlData.Enums)) {

    // First entry in Enums array are the functions
    const functionsYaml: YamlBmapFunction[] = functionYamlData.Enums[0].Options;
    console.log('function count: ' + functionsYaml.length);
    for (const yamlBmapFunction of functionsYaml) {
      yamlBmapFunction.Operators = [];
      const bsBmapFunction: BsBmapFunction = objectKeysToLowerCase(yamlBmapFunction);
      bsFunctionBlock.functions.push(bsBmapFunction);
      // getOperators(bsFunctionBlock, bmapFunction);
    }

    // // Remaining entries in the Enums array are the actual enums
    // for (let i = 1; i < functionYamlData.Enums.length; i++) {
    //   const enumDefinition = functionYamlData.Enums[i];
    //   const enumName = enumDefinition.Name;
    //   const enumDescription = enumDefinition.Description;
    //   const enumOptions = enumDefinition.Options;

    //   const bmapEnumOptions: BsBmapEnumOption[] = [];

    //   for (const enumOption of enumOptions) {
    //     const bmapEnumOption: BmapEnumOption = {
    //       Name: enumOption.Name,
    //       Description: enumOption.Description,
    //       Value: enumOption.Value,
    //     };
    //     // bmapEnumOptions.push(bmapEnumOption);
    //   }

    //   const bmapEnum: BsBmapEnum = {
    //     name: enumName,
    //     description: enumDescription,
    //     options: bmapEnumOptions
    //   };
    //   bsFunctionBlock.Enums.push(bmapEnum);
    // }
  }
}

function getOperators(bmapFunctionBlock: BmapFunctionBlock, bmapFunction: BmapFunction) {

  const path = yamlInputDirectory + '/' + bmapFunctionBlock.Name + '/' + bmapFunction.Name + '.yaml';
  console.log(path);

  if (bmapFunction.Name == 'GestureRecognition') {
    console.log('found');
  }
  if (bmapFunction.Name === 'OneRecord') {
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
        const enumName = enumDefinition.Name;
        const enumDescription = enumDefinition.Description;
        const enumOptions = enumDefinition.Options;

        const bmapEnumOptions: BmapEnumOption[] = [];

        for (const enumOption of enumOptions) {
          const bmapEnumOption: BmapEnumOption = {
            Name: enumOption.Name,
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
    let newVal: any;
    if (val !== null && val !== undefined) {
      newVal = (typeof val === 'object') ? objectKeysToLowerCase(val) : val;
    }
    const newKey: string = key.charAt(0).toLowerCase() + key.substring(1);
    newObj[newKey] = newVal;
    return newObj;
  }, {});
};
