import * as fs from 'fs-extra';
import { safeLoad } from 'js-yaml';

export function parseYaml() {
  console.log('parseYaml invoked in typescript file');

  const bmapYamlData: any = safeLoad(fs.readFileSync('BMAP.yaml', 'utf8'));
  console.log(bmapYamlData);
  
}
