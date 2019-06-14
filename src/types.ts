export interface BmapFunctionBlock {
  Value: number;
  Name: string;
  Category: string;
  Description: string;
  Mandatory: string;
  Version: string;
  bmapFunctions: BmapFunction[];
}

export interface BmapFunction {
  Description: string;
  LongDescription: string;
  Mandatory: string;
  Name: string;
  Value: number;
}
