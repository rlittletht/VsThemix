
import { Guid } from "../util/Guid";
import { ICategoryDefinition } from "./ICategoryDefinition";

export interface IThemeDefinition
{
    name: string;
    description: string;
    extensionIdentity: string;
    author: string;
    version: string;
    guid: string | Guid;
    vsTargetMin?: string;
    vsTargetMax?: string;
    fallback: string | Guid;
    categories: ICategoryDefinition[];
    extensionDir: string;
}