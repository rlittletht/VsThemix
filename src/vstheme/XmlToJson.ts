import * as fs from 'fs';
import { parseStringPromise } from 'xml2js';
import { IThemeDefinition } from './IThemeDefinition';
import { ICategoryDefinition } from './ICategoryDefinition';
import { IElementDefinition } from './IElementDefinition';
import { Guid } from '../util/Guid';
import { ThemeCompiler } from './ThemeCompiler';
import { IJsonStringifyOptions, JsonStringifier } from '../util/JsonStringifier';
import { Builtins } from './Builtins';

// Interfaces for the XML structure
interface IXmlColor
{
    $: {
        Name: string;
    };
    Background?: Array<{
        $: {
            Type: string;
            Source: string;
        };
    }>;
    Foreground?: Array<{
        $: {
            Type: string;
            Source: string;
        };
    }>;
}

interface IXmlCategory
{
    $: {
        Name: string;
        GUID: string;
    };
    Color: IXmlColor[];
}

interface IXmlTheme
{
    $: {
        Name: string;
        GUID: string;
        BaseGUID?: string;
        FallbackId: string;
    };
    Category: IXmlCategory[];
}

interface IXmlThemes
{
    Themes: {
        Theme: IXmlTheme[];
    };
}

export class XmlToJson
{
    private m_source: string;
    private m_destination: string;

    constructor(source: string, destination: string)
    {
        this.m_source = source;
        this.m_destination = destination;
    }

    /**
     * Parse the XML content and convert to theme definition structure
     */
    private static parseColorValue(type: string, source: string): string | undefined
    {
        if (type === "CT_INVALID" || source === "00000000")
        {
            return undefined;
        }
        if (type === "CT_RAW")
        {
            // Convert ARGB format to #RRGGBB format
            if (source.length === 8)
            {
                // Source is in AARRGGBB format, extract RRGGBBAA
                return `#${source.substring(2)}${source.substring(0, 2)}`;
            }
            return `#${source}`;
        }
        return undefined;
    }

    /**
     * Convert XML theme structure to JSON theme definition
     */
    convertToThemeDefinition(xmlData: IXmlThemes): IThemeDefinition
    {
        const xmlTheme = xmlData.Themes.Theme[0];

        const categoryDefinitions: ICategoryDefinition[] = [];

        if (xmlTheme.Category)
        {
            for (const xmlCategory of xmlTheme.Category)
            {
                const elements: IElementDefinition[] = [];

                if (xmlCategory.Color)
                {
                    for (const xmlColor of xmlCategory.Color)
                    {
                        const background = xmlColor.Background && xmlColor.Background[0]
                            ? XmlToJson.parseColorValue(xmlColor.Background[0].$.Type, xmlColor.Background[0].$.Source)
                            : undefined;

                        const foreground = xmlColor.Foreground && xmlColor.Foreground[0]
                            ? XmlToJson.parseColorValue(xmlColor.Foreground[0].$.Type, xmlColor.Foreground[0].$.Source)
                            : undefined;

                        elements.push({
                            element: xmlColor.$.Name,
                            background,
                            foreground,
                            fontStyle: undefined
                        });
                    }
                }

                const category: ICategoryDefinition = {
                    category: xmlCategory.$.Name,
                    elements
                };

                const builtin = Builtins.ReduceGuidToBuiltinName(new Guid(xmlCategory.$.GUID));
                if (builtin)
                {
                    category.category = `builtin:${category.category}`;
                }
                else
                {
                    category.guid = xmlCategory.$.GUID;
                }
                categoryDefinitions.push(category);
            }
        }

        const builtinFallback = Builtins.ReduceGuidToBuiltinName(new Guid(xmlTheme.$.FallbackId));

        if (builtinFallback)
        {
            xmlTheme.$.FallbackId = `${builtinFallback}`;
        }

        const themeDefinition: IThemeDefinition = {
            name: xmlTheme.$.Name,
            description: `${xmlTheme.$.Name} theme`,
            extensionIdentity: "<<Extension Identity>>",
            author: "<<Author>>",
            version: "<<Version>>",
            guid: xmlTheme.$.GUID,
            fallback: xmlTheme.$.FallbackId,
            categoryDefinitions,
        };

        return themeDefinition;
    }

    /**
     * Parse a vstheme XML file and return the theme definition
     */
    async parseVsThemeFile(filePath: string): Promise<IThemeDefinition>
    {
        // Read the XML file
        const xmlContent = fs.readFileSync(filePath, 'utf-8');

        // Parse XML to JavaScript object
        // preserveChildrenOrder and explicitChildren help maintain structure
        const parseOptions = {
            explicitArray: true,
            mergeAttrs: false,
            explicitCharkey: false,
            charkey: '_',
            attrkey: '$'
        };

        const xmlData = await parseStringPromise(xmlContent, parseOptions) as IXmlThemes;

        // Convert to theme definition
        return this.convertToThemeDefinition(xmlData);
    }

    async Convert(): Promise<void>
    {
        // Parse the XML file to get theme definition
        const themeDefinition: IThemeDefinition = await this.parseVsThemeFile(this.m_source);

        const options: IJsonStringifyOptions = {
            maxInlineLength: 180,
            inlineArrays: true,
            inlineObjects: true
        };

        const stringifier = new JsonStringifier(options);
        const jsonContent = stringifier.stringify(themeDefinition).replace(/\r?\n/g, "\r\n");

        fs.writeFileSync(this.m_destination, jsonContent, 'utf-8');
    }

    static async ConvertXmlToJson(source: string, destination: string): Promise<void>
    {
        const converter = new XmlToJson(source, destination);

        await converter.Convert();
        console.log(`Successfully converted ${source} to ${destination}`);
    }
}