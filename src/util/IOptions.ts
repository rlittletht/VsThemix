
export interface IOptions
{
    themeDef: string;
    output: string;
    runUnitTests: boolean;
}

export const _defaultOptions: IOptions =
{
    themeDef: "",
    output: "",
    runUnitTests: false
}
