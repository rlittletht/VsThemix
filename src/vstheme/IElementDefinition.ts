
import { FontStyleEnum } from "./FontStyleEnum";

export interface IElementDefinition
{
    element: string;
    background: string | undefined;
    foreground: string | undefined;
    fontStyle: FontStyleEnum | undefined;
}