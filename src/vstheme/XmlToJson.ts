import * as fs from 'fs';
import { parseStringPromise } from 'xml2js';
import { IThemeDefinition } from './IThemeDefinition.js';
import { ICategoryDefinition } from './ICategoryDefinition.js';
import { IElementDefinition } from './IElementDefinition.js';
import { Guid } from '../util/Guid.js';

// Interfaces for the XML structure
interface IXmlColor {
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

interface IXmlCategory {
    $: {
        Name: string;
        GUID: string;
    };
    Color: IXmlColor[];
}

interface IXmlTheme {
    $: {
        Name: string;
        GUID: string;
        BaseGUID?: string;
        FallbackId: string;
    };
    Category: IXmlCategory[];
}

interface IXmlThemes {
    Themes: {
        Theme: IXmlTheme[];
    };
}

export class XmlToJson
{
    /**
     * Parse the XML content and convert to theme definition structure
     */
    private static parseColorValue(type: string, source: string): string | undefined {
        if (type === "CT_INVALID" || source === "00000000") {
            return undefined;
        }
        if (type === "CT_RAW") {
            // Convert ARGB format to #RRGGBB format
            if (source.length === 8) {
                // Source is in AARRGGBB format, extract RRGGBB
                return `#${source.substring(2)}`;
            }
            return `#${source}`;
        }
        return undefined;
    }

    /**
     * Convert XML theme structure to JSON theme definition
     */
    private static convertToThemeDefinition(xmlData: IXmlThemes): IThemeDefinition {
        const xmlTheme = xmlData.Themes.Theme[0];
        
        const categoryDefinitions: ICategoryDefinition[] = [];
        
        if (xmlTheme.Category) {
            for (const xmlCategory of xmlTheme.Category) {
                const elements: IElementDefinition[] = [];
                
                if (xmlCategory.Color) {
                    for (const xmlColor of xmlCategory.Color) {
                        const background = xmlColor.Background && xmlColor.Background[0]
                            ? this.parseColorValue(xmlColor.Background[0].$.Type, xmlColor.Background[0].$.Source)
                            : undefined;
                        
                        const foreground = xmlColor.Foreground && xmlColor.Foreground[0]
                            ? this.parseColorValue(xmlColor.Foreground[0].$.Type, xmlColor.Foreground[0].$.Source)
                            : undefined;
                        
                        elements.push({
                            element: xmlColor.$.Name,
                            background,
                            foreground,
                            fontStyle: undefined
                        });
                    }
                }
                
                categoryDefinitions.push({
                    category: xmlCategory.$.Name,
                    guid: xmlCategory.$.GUID,
                    elements
                });
            }
        }
        
        const themeDefinition: IThemeDefinition = {
            name: xmlTheme.$.Name,
            description: `${xmlTheme.$.Name} theme`,
            extensionIdentity: xmlTheme.$.GUID,
            author: "Unknown",
            version: "1.0.0",
            guid: xmlTheme.$.GUID,
            fallback: xmlTheme.$.FallbackId,
            categoryDefinitions,
            extensionDir: ""
        };
        
        return themeDefinition;
    }

    /**
     * Parse a vstheme XML file and return the theme definition
     */
    static async parseVsThemeFile(filePath: string): Promise<IThemeDefinition> {
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

    static ConvertXmlToJson(source: string, destination: string): void
    {
        this.parseVsThemeFile(source).then(themeDefinition => {
            const jsonContent = JSON.stringify(themeDefinition, null, 2);
            fs.writeFileSync(destination, jsonContent, 'utf-8');
            console.log(`Successfully converted ${source} to ${destination}`);
        }).catch(error => {
            console.error(`Error converting XML to JSON: ${error}`);
            throw error;
        });
    }
}