
import { VsixBuilder } from "../util/VsixBuilder";
import { IThemeDefinition } from "./IThemeDefinition";
import { Guid } from "../util/Guid";

export class Pkgdef
{
    static AddPkgdefToVsix(builder: VsixBuilder, theme: IThemeDefinition): void
    {
        const pkgdef = builder.AddFile("extension.pkgdef");
        const themeGuid = (theme.guid as Guid).ToString();

        pkgdef.writer.writeLine(`@={theme.name}`);
        pkgdef.writer.writeLine(`"Name"="{theme.name}"`);
        pkgdef.writer.writeLine(`"Fallback"="{(theme.fallback as Guid).ToString()}"`);
        for(const category of theme.categories)
        {
            if (!category.guid)
                throw new Error(`Category "${category.name}" is missing a GUID in theme "${theme.name}".`);

            const categoryGuid = (category.guid as Guid).ToString();

            pkgdef.writer.writeLine(`[$RootKey$\\Themes\\{themeGuid}\\{category.name}]`);
        }
    }
}