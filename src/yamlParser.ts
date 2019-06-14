import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

import {
  BmapFunction,
  BmapFunctionBlock
} from './types';
import { isArray, isObject } from 'lodash';

const functionBlocks: BmapFunctionBlock[] = [];

export function parseYaml() {
  console.log('parseYaml invoked in typescript file');

  const bmapYamlData: any = safeLoad(fs.readFileSync('BMAP.yaml', 'utf8'));
  console.log(bmapYamlData);

  const FBlocksYaml = bmapYamlData.Enums[0].Options;
  console.log('FBlocksYaml');
  console.log(FBlocksYaml);

  console.log('ProductInfo function block');
  console.log(bmapYamlData.Enums[0].Options[0].Name);
  console.log(bmapYamlData.Enums[0].Options[0]);

  // console.log('invoke getFBlocks');
  // FBlockList = getFBlocks();
  // console.log('display FBlockList');
  // console.log(FBlockList);

  for (const functionBlock of bmapYamlData.Enums[0].Options) {
    functionBlock.bmapFunctions = [];
    functionBlocks.push(functionBlock);
    getFunctions(functionBlock);
  }

  console.log(functionBlocks);
}

function getFunctions(functionBlock: BmapFunctionBlock) {
  const path = './BMAP_YAML/' + functionBlock.Name + '/' + functionBlock.Name + '.yaml';
  console.log(path);

  const functionYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
  console.log(functionYamlData);

  if (isObject(functionYamlData) && isArray(functionYamlData.Enums)) {
    const functionsYaml = functionYamlData.Enums[0].Options;
    for (const bmapFunction of functionsYaml) {
      bmapFunction.bmapOperators = [];
      functionBlock.bmapFunctions.push(bmapFunction as BmapFunction);
      getOperators(functionBlock, bmapFunction);
    }
  }
}

function getOperators(bmapFunctionBlock: BmapFunctionBlock, bmapFunction: BmapFunction) {

  const path = './BMAP_YAML/' + bmapFunctionBlock.Name + '/' + bmapFunction.Name + '.yaml';
  console.log(path);

  try {
    const operatorYamlData: any = safeLoad(fs.readFileSync(path, 'utf8'));
    console.log(operatorYamlData);
    if (isObject(operatorYamlData) && isObject(operatorYamlData.Messages)) {
      const bmapOperators: any[] = operatorYamlData.Messages;
      for (const bmapOperator of bmapOperators) {
        bmapFunction.bmapOperators.push(bmapOperator);
      }
    }
  } catch (e) {
    console.log(e);
  }

}
