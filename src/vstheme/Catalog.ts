
import { VsixBuilder } from "../util/VsixBuilder";
import { IThemeDefinition } from "./IThemeDefinition";

interface IPackageLocalizedResourceContent
{
    language: string;
    title: string;
    description: string;
}

interface IPackagePayloadContent
{
    fileName: string;
    size?: number;
}

interface IPackagePayloadInstallSizes
{
    installSize: number;
}

interface ICatalogPackageContent
{
    id: string;
    version: string;
    type: string;
    extension?: boolean;
    dependencies?: { [key: string]: string };
    localizedResources?: IPackageLocalizedResourceContent[];

    vsixId?: string;
    extensionDir?: string;
    payloads?: IPackagePayloadContent[];
    installSizes?: IPackagePayloadInstallSizes;    
}

interface ICatalogContent
{
    manifestVersion: string;
    info: {
        id: string;
        manifestType: string;
    };
    packages: ICatalogPackageContent[];

}

export class Catalog
{
    static AddCatalogToVsix(builder: VsixBuilder, theme: IThemeDefinition): void
    {
        const catalog = builder.AddFile("catalog.json");
        const extensionName = builder.OutputFilename.split(/[\\/]/).pop() || builder.OutputFilename;

        const catalogData: ICatalogContent = {
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
                            fileName: extensionName
                        }
                    ]
                }
            ]
        };
        
        catalog.writer.writeLine(JSON.stringify(catalogData, null, 2));
    }
}