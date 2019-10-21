export interface BmapFunctionBlock {
  Value: number;
  name: string;
  Category: string;
  Description: string;
  Mandatory: string;
  Version: string;
  Functions: BmapFunction[];
  Enums: BmapEnum[];
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
