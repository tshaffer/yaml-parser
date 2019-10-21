export interface BsBmapFunctionBlock {
  value: number;
  name: string;
  category: string;
  description: string;
  mandatory: string;
  version: string;
  functions: BsBmapFunction[];
  enums: BsBmapEnum[];
}

export interface BsBmapEnum {
  name: string;
  description: string;
  options: BsBmapEnumOption[];
}

export interface BsBmapEnumOption {
  name: string;
  description: string;
  value: number;
}

export interface BsBmapFunction {
  description: string;
  longDescription: string;
  mandatory: string;
  name: string;
  value: number;
  operators: BsBmapOperator[];
  enums: BsBmapEnum[];
}

export interface BsBmapOperator {
  description: string;
  function: string;
  functionBlock: string;
  operator: string;
  fields?: any[];
}

export interface BsBmapField {
  Count: number;
  Description: string;
  Name: string;
  Type: string;
  Units: string;
  VariableLength: boolean;
}

export interface YamlBmapFunctionBlock {
  Value: number;
  Name: string;
  Category: string;
  Description: string;
  Mandatory: string;
  Version: string;
  Functions: BsBmapFunction[];
  Enums: BsBmapEnum[];
}

export interface YamlBmapEnum {
  Name: string;
  Description: string;
  Options: YamlBmapEnumOption[];
}

export interface YamlBmapEnumOption {
  Name: string;
  Description: string;
  Value: number;
}

export interface YamlBmapFunction {
  Description: string;
  LongDescription: string;
  Mandatory: string;
  Name: string;
  Value: number;
  Operators: YamlBmapOperator[];
  Enums: YamlBmapEnum[];
}

export interface YamlBmapOperator {
  Description: string;
  Function: string;
  FunctionBlock: string;
  Operator: string;
  Fields?: any[];
}

export interface YamlBmapField {
  Count: number;
  Description: string;
  Name: string;
  Type: string;
  Units: string;
  VariableLength: boolean;
}

export interface BmapFunctionBlock {
  Value: number;
  Name: string;
  Category: string;
  Description: string;
  Mandatory: string;
  Version: string;
  Functions: BsBmapFunction[];
  Enums: BsBmapEnum[];
}

export interface BmapEnum {
  Name: string;
  Description: string;
  Options: BmapEnumOption[];
}

export interface BmapEnumOption {
  Name: string;
  Description: string;
  Value: number;
}

export interface BmapFunction {
  Description: string;
  LongDescription: string;
  Mandatory: string;
  Name: string;
  Value: number;
  Operators: BmapOperator[];
  Enums: BmapEnum[];
}

export interface BmapOperator {
  Description: string;
  Function: string;
  FunctionBlock: string;
  Operator: string;
  Fields?: any[];
}

export interface BmapField {
  Count: number;
  Description: string;
  Name: string;
  Type: string;
  Units: string;
  VariableLength: boolean;
}
