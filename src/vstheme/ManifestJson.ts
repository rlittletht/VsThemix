
import { VsixBuilder } from "../util/VsixBuilder";
import { IThemeDefinition } from "./IThemeDefinition";

interface IManifestJsonFileEntry
{
    fileName: string;
    sha256: string | null;
}

interface IManifestJsonContent
{
    id: string;
    version: string;
    type: string;
    vsixId: string;
    extensionDir: string;
    dependencies: { [key: string]: string };
    files: IManifestJsonFileEntry[];
}

export class ManifestJson
{
    static AddManifestJsonToVsix(builder: VsixBuilder, theme: IThemeDefinition): void
    {
        const manifestJson = builder.AddFile("manifest.json");

        const files: IManifestJsonFileEntry[] = [
            { fileName: "/extension.vsixmanifest", sha256: null },
            { fileName: "/extension.pkgdef", sha256: null }
        ];

        const manifest: IManifestJsonContent = {
            id: theme.extensionIdentity,
            version: theme.version,
            type: "Vsix",
            vsixId: theme.extensionIdentity,
            extensionDir: theme.extensionDir,
            dependencies: {
                "Microsoft.VisualStudio.Component.CoreEditor": `[${theme.vsTargetMin || "18.0"},${theme.vsTargetMax || "19.0"})`
            },
            files: files
        };

        manifestJson.writer.writeLine(JSON.stringify(manifest, null, 2));
    }
}