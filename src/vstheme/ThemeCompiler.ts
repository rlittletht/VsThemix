
import { IThemeDefinition } from "./IThemeDefinition";
import { JsonReader } from "../util/JsonReader";
import { VsixBuilder } from "../util/VsixBuilder";
import { IStreamWriter } from "../util/StreamWriter";
import { Manifest } from "./Manifest";
import { ContentTypes } from "./ContentTypes";
import { Catalog } from "./Catalog";
import { ManifestJson } from "./ManifestJson";
import { Guid } from "../util/Guid";

export class ThemeCompiler
{
    private m_output: string;

    constructor(output: string)
    {
        this.m_output = output;
    }

    static ValidateTheme(themeDef: IThemeDefinition): boolean
    {
        themeDef.guid = new Guid(themeDef.guid as string);

        // validate version
        const versionRegex = /^\d+\.\d+\.\d+(\.\d+)?$/;
        if (!versionRegex.test(themeDef.version))
            throw new Error(`Invalid version format: ${themeDef.version}`);

        return true;
    }

    static getRandomExtensionDir(theme: IThemeDefinition): string
    {
        const reversed_guid = (theme.guid as Guid).ToStringReverse();

        return `[installdir]\\\\Common7\\\\IDE\\\\Extensions\\\\${reversed_guid.substring(0, 8)}.${reversed_guid.substring(8, 11)}`;
    }

    private static readonly builtinNameMap: Map<string, Guid> = new Map([
        ["builtin:Dark", new Guid("1ded0138-47ce-435e-84ef-9ec1f439b749")],
        ["builtin:ShellInternal", new Guid("5af241b7-5627-4d12-bfb1-2b67d11127d7")],
        ["builtin:Shell", new Guid("73708ded-2d56-4aad-b8eb-73b20d3f4bff")]
    ]);

    static expandOrThrow(builtinName: string): Guid
    {
        if (!builtinName.startsWith("builtin:"))
        {
            const guid = this.builtinNameMap.get(builtinName);

            if (!guid)
                throw new Error(`unknown builtin theme name: ${builtinName}`);

            return guid;
        }

        return new Guid(builtinName);
    }

    static ExpandBuiltinNames(themeDef: IThemeDefinition): void
    {
        themeDef.fallback = this.expandOrThrow(themeDef.fallback as string);

        for (const category of themeDef.categories)
        {
            if (category.name.startsWith("builtin:"))
            {
                category.guid = this.expandOrThrow(category.name);
                category.name = category.name.substring("builtin:".length);
            }
            else
            {
                if (!category.guid)
                    throw new Error(`Category "${category.name}" is missing a GUID in theme "${themeDef.name}".`);

                category.guid = new Guid(category.guid as string);
            }
        }
    }

    CompileTheme(themeDefPath: string): void
    {
        const theme = JsonReader.ReadJsonFile<IThemeDefinition>(themeDefPath);

        if (theme == null)
            throw new Error(`failed to read theme definition: ${themeDefPath}`);

        theme.extensionDir = ThemeCompiler.getRandomExtensionDir(theme);

        ThemeCompiler.ValidateTheme(theme);
        ThemeCompiler.ExpandBuiltinNames(theme);

        const builder: VsixBuilder = new VsixBuilder(this.m_output);

        Manifest.AddManifestToVsix(builder, theme);
        ContentTypes.AddContentTypesToVsix(builder);
        Catalog.AddCatalogToVsix(builder, theme);
        ManifestJson.AddManifestJsonToVsix(builder, theme);

        builder.BuildVsix();
    }
}