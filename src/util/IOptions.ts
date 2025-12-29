
export enum Operation
{
    compile = "compile",
    xmlToJson = "xml-to-json",
    jsonToXml = "json-to-xml"
}

export interface IOptions
{
    operation: Operation;
    source: string;
    destination: string;
    runUnitTests: boolean;
    saveTemps: boolean;
}

export const _defaultOptions: IOptions =
{
    operation: Operation.compile,
    source: "",
    destination: "",
    runUnitTests: false,
    saveTemps: false
}
