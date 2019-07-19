import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

import {
  BmapFunction,
  BmapFunctionBlock
} from './types';
import { isArray, isObject } from 'lodash';

const functionBlocks: BmapFunctionBlock[] = [];
let yamlInputDirectory: string;
let bmapOutputDirectory: string;

export function parseYaml(yaml_input_directory: string, bmap_output_directory: string) {
  console.log('parseYaml invoked in typescript file');

  yamlInputDirectory = yaml_input_directory;
  bmapOutputDirectory = bmap_output_directory;

  const bmapYamlData: any = safeLoad(fs.readFileSync('../BMAP_Yaml/BMAP.yaml', 'utf8'));
  console.log(bmapYamlData);

  const FBlocksYaml = bmapYamlData.Enums[0].Options;
  console.log('FBlocksYaml');
  console.log(FBlocksYaml);

  console.log('ProductInfo function block');
  console.log(bmapYamlData.Enums[0].Options[0].Name);
  console.log(bmapYamlData.Enums[0].Options[0]);

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    functionBlock.Functions = [];
    functionBlocks.push(functionBlock);
    getFunctions(functionBlock);
  }

  console.log(functionBlocks);

  const bmap: any = {};
  bmap.Name = 'BMAP';
  bmap.Version = '0.0.1';
  bmap.Type = 'BMAP';
  bmap.FunctionBlocks = functionBlocks;
  const bmapJson: string = JSON.stringify(bmap, null, 2);
  fs.writeFileSync(bmapOutputDirectory + '/bmap.json', bmapJson);
}

function getFunctions(functionBlock: BmapFunctionBlock) {
  const path = yamlInputDirectory + '/' + functionBlock.Name + '/' + functionBlock.Name + '.yaml';
  console.log(path);

  const functionYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
  console.log(functionYamlData);

  if (isObject(functionYamlData) && isArray(functionYamlData.Enums)) {
    const functionsYaml = functionYamlData.Enums[0].Options;
    for (const bmapFunction of functionsYaml) {
      bmapFunction.Operators = [];
      functionBlock.Functions.push(bmapFunction as BmapFunction);
      getOperators(functionBlock, bmapFunction);
    }
  }
}

function getOperators(bmapFunctionBlock: BmapFunctionBlock, bmapFunction: BmapFunction) {

  const path = yamlInputDirectory + '/' + bmapFunctionBlock.Name + '/' + bmapFunction.Name + '.yaml';
  console.log(path);

  try {
    const operatorYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
    console.log(operatorYamlData);
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
