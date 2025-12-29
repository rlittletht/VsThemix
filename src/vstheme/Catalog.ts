
import { VsixBuilder } from "../util/VsixBuilder";
import { IThemeDefinition } from "./IThemeDefinition";

export class Catalog
{
    static AddCatalogToVsix(builder: VsixBuilder, theme: IThemeDefinition): void
    {
        const catalog = builder.AddFile("catalog.json");
        
        const catalogData = {
            manifestVersion: "1.1",
            info: {
                id: `${theme.extensionIdentity},version=${theme.version}`,
                manifestType: "Extension"
            },
            packages: [
                {
                    id: `Component.${theme.extensionIdentity}`,
                    version: theme.version,
                    type: "Component",
                    extension: true,
                    dependencies: {
                        [theme.extensionIdentity]: theme.version,
                        "Microsoft.VisualStudio.Component.CoreEditor": `[${theme.vsTargetMin || "18.0"},${theme.vsTargetMax || "19.0"})`
                    },
                    localizedResources: [
                        {
                            language: "en-US",
                            title: theme.name,
                            description: theme.description
                        }
                    ]
                },
                {
                    id: theme.extensionIdentity,
                    version: theme.version,
                    type: "Vsix",
                    vsixId: theme.extensionIdentity,
                    extensionDir: theme.extensionDir,
                    payloads: [
                        {
                            fileName: builder.OutputFilename
                        }
                    ]
                }
            ]
        };
        
        catalog.writer.writeLine(JSON.stringify(catalogData));
    }
}