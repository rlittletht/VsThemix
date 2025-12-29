
import { Guid } from "../util/Guid";
import { IElementDefinition } from "./IElementDefinition";

export interface ICategoryDefinition
{
    name: string;
    guid?: string | Guid;
    elements: IElementDefinition[];
}