
import { Guid } from "../util/Guid";
import { IElementDefinition } from "./IElementDefinition";

export interface ICategoryDefinition
{
    category: string;
    guid?: string | Guid;
    elements: IElementDefinition[];
}