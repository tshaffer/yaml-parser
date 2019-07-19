export interface BmapFunctionBlock {
  Value: number;
  Name: string;
  Category: string;
  Description: string;
  Mandatory: string;
  Version: string;
  Functions: BmapFunction[];
}

export interface BmapFunction {
  Description: string;
  LongDescription: string;
  Mandatory: string;
  Name: string;
  Value: number;
  Operators: BmapOperator[];
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
