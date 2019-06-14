import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

import {
  FunctionBlock
} from './types';

const functionBlocks: FunctionBlock[] = [];

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
    functionBlocks.push(functionBlock);   
  }

  console.log(functionBlocks);
}
