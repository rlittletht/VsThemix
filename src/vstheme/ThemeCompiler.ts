
import { IThemeDefinition } from "./IThemeDefinition";
import { JsonReader } from "../util/JsonReader";
import { VsixBuilder } from "../util/VsixBuilder";
import { IStreamWriter } from "../util/StreamWriter";
import { Manifest } from "./Manifest";
import { ContentTypes } from "./ContentTypes";
import { Catalog } from "./Catalog";
import { ManifestJson } from "./ManifestJson";
import { Guid } from "../util/Guid";
import { Pkgdef } from "./Pkgdef";
import { Builtins } from "./Builtins";

export class ThemeCompiler
{
    private m_output: string;

    constructor(output: string)
    {
        this.m_output = output;
    }

    static ValidateTheme(themeDef: IThemeDefinition): boolean
    {
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

    async CompileTheme(themeDefPath: string, saveTemps: boolean): Promise<void>
    {
        const theme = JsonReader.ReadJsonFile<IThemeDefinition>(themeDefPath);

        if (theme == null)
            throw new Error(`failed to read theme definition: ${themeDefPath}`);

        Builtins.ExpandBuiltinNames(theme);
        theme.extensionDir = ThemeCompiler.getRandomExtensionDir(theme);

        ThemeCompiler.ValidateTheme(theme);

        const builder: VsixBuilder = new VsixBuilder(this.m_output);

        Manifest.AddManifestToVsix(builder, theme);
        ContentTypes.AddContentTypesToVsix(builder);
        Catalog.AddCatalogToVsix(builder, theme);
        ManifestJson.AddManifestJsonToVsix(builder, theme);
        Pkgdef.AddPkgdefToVsix(builder, theme);

        await builder.BuildVsix(saveTemps);
    }
}