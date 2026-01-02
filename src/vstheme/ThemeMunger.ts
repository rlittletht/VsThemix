
import { IThemeDefinition } from "./IThemeDefinition";
import { JsonReader } from "../util/JsonReader";
import * as path from "path";
import { ColorSet } from "../util/ColorSet";
import { IJsonStringifyOptions, JsonStringifier } from "../util/JsonStringifier";
import * as fs from "fs";

export class ThemeMunger
{
    private m_destinationPath: string;

    constructor(destinationPath: string)
    {
        this.m_destinationPath = destinationPath;
    }

    async MakeUniqueColors(source: string): Promise<void>
    {
        const theme = JsonReader.ReadJsonFile<IThemeDefinition>(source);

        if (theme == null)
            throw new Error(`failed to read theme definition: ${source}`);

        // now map all the colors to unique values

        const colorSet: ColorSet = new ColorSet();
        for (const categoryDef of theme.categoryDefinitions)
        {
            for (const element of categoryDef.elements)
            {
                if (element.background !== undefined)
                    element.background = colorSet.GetUniqueColorString(element.background);

                if (element.foreground !== undefined)
                    element.foreground = colorSet.GetUniqueColorString(element.foreground);
            }
        }

        // and now write it back out
        const options: IJsonStringifyOptions = {
            maxInlineLength: 180,
            inlineArrays: true,
            inlineObjects: true
        };

        const stringifier = new JsonStringifier(options);
        const jsonContent = stringifier.stringify(theme).replace(/\r?\n/g, "\r\n");

        fs.writeFileSync(this.m_destinationPath, jsonContent, 'utf-8');
    }
}