import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

import {
  BmapEnum,
  BmapFunction,
  BmapFunctionBlock,
  BmapEnumOption
} from './types';
import { isArray, isObject } from 'lodash';

const functionBlocks: BmapFunctionBlock[] = [];
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

  // const bmapYamlData: any = safeLoad(fs.readFileSync(yamlInputDirectory + '/BMAP.yaml', 'utf8'));
  const bmapYamlData: any = safeLoad(fs.readFileSync(yamlInputDirectory + '/headers/BMAP.yaml', 'utf8'));

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

  const bmap: any = {};
  bmap.Name = 'BMAP';
  bmap.Version = '0.0.1';
  bmap.Type = 'BMAP';
  bmap.FunctionBlocks = functionBlocks;
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

function getFunctions(functionBlock: BmapFunctionBlock) {

  console.log('\n');
  console.log('Function block: ' + functionBlock.Name);

  const path = yamlInputDirectory + '/' + functionBlock.Name + '/' + functionBlock.Name + '.yaml';
  console.log('path: ' + path);
  const functionYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));

  if (isObject(functionYamlData) && isArray(functionYamlData.Enums)) {

    // First entry in Enums array are the functions
    const functionsYaml = functionYamlData.Enums[0].Options;
    console.log('function count: ' + functionsYaml.length);
    for (const bmapFunction of functionsYaml) {
      bmapFunction.Operators = [];
      functionBlock.Functions.push(bmapFunction as BmapFunction);
      getOperators(functionBlock, bmapFunction);
    }

    // Remaining entries in the Enums array are the actual enums
    for (let i = 1; i < functionYamlData.Enums.length; i++) {
      const enumDefinition = functionYamlData.Enums[i];
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
      functionBlock.Enums.push(bmapEnum);
    }
    // const numEnumDefinitions = functionYamlData.Enums.length - 1;
    // for (let i = 0; i < numEnumDefinitions; i++) {

    // }
    // if (functionYamlData.Enums.length > 1 && isArray(functionYamlData.Enums[1].Options)) {
    //   console.log('Enum: ' + functionYamlData.Enums[1].Name);
    //   console.log('Count: ' + functionYamlData.Enums[1].Options.length);
    //   functionBlock.EnumName = functionYamlData.Enums[1].Name;
    //   functionBlock.Enums = [];
    //   for (const bmapEnum of functionYamlData.Enums[1].Options) {
    //     const optionsEnum: BmapEnum = {
    //       Name: bmapEnum.Name,
    //       Value: bmapEnum.Value,
    //       Description: bmapEnum.Description,
    //     };
    //     functionBlock.Enums.push(optionsEnum);
    //   }
    // }
  }
}

function getOperators(bmapFunctionBlock: BmapFunctionBlock, bmapFunction: BmapFunction) {

  const path = yamlInputDirectory + '/' + bmapFunctionBlock.Name + '/' + bmapFunction.Name + '.yaml';

  try {
    // console.log('safeLoad directory: ' + path);
    const operatorYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
    if (isObject(operatorYamlData) && isObject(operatorYamlData.Messages)) {
      const bmapOperators: any[] = operatorYamlData.Messages;
      for (const bmapOperator of bmapOperators) {
        bmapFunction.Operators.push(bmapOperator);
      }
    }
  } catch (e) {
    console.log(e);
  }
}
