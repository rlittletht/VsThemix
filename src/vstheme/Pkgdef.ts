
import { VsixBuilder } from "../util/VsixBuilder";
import { IThemeDefinition } from "./IThemeDefinition";
import { Guid } from "../util/Guid";
import { ByteArray, ByteOrder } from "../util/ByteArray";
import { PkgString } from "./PkgString";
import { FontStyleEnum } from "./FontStyleEnum";
import { Color } from "../util/Color";

export class Pkgdef
{
    static AddPkgdefToVsix(builder: VsixBuilder, theme: IThemeDefinition): void
    {
        const pkgdef = builder.AddFile("extension.pkgdef");
        const themeGuid = (theme.guid as Guid).ToString();

        pkgdef.writer.writeLine(`[$RootKey$\\Themes\\${(theme.guid as Guid).ToString()}]`);
        pkgdef.writer.writeLine(`@="${theme.name}"`);
        pkgdef.writer.writeLine(`"Name"="${theme.name}"`);
        pkgdef.writer.writeLine(`"FallbackId"="${(theme.fallback as Guid).ToString()}"`);
        
        for (const category of theme.categoryDefinitions)
        {
            if (!category.guid)
                throw new Error(`Category "${category.category}" is missing a GUID in theme "${theme.name}".`);

            const categoryGuid = (category.guid as Guid).ToString();

            pkgdef.writer.writeLine("");
            pkgdef.writer.writeLine(`[$RootKey$\\Themes\\${themeGuid}\\${category.category}]`);
            const categoryBytes: ByteArray = new ByteArray();

            categoryBytes.addInt32(11, ByteOrder.LittleEndian); // constant
            categoryBytes.addInt32(1, ByteOrder.LittleEndian); // constant

            categoryBytes.add((category.guid as Guid).ToBytes());
            categoryBytes.addInt32(category.elements.length, ByteOrder.LittleEndian);

            // now add all the elements
            for (const element of category.elements)
            {
                const name: Uint8Array = new PkgString(element.element).ToBytes();

                categoryBytes.add(name);

                if (element.fontStyle !== undefined)
                {
                    const backgroundOrMask = new Uint8Array(5);

                    if (element.background !== undefined)
                        throw new Error(`Element "${element.element}" in category "${category.category}" of theme "${theme.name}" has fontStyle set along with foreground or background.`);

                    backgroundOrMask[0] = 0x02;
                    backgroundOrMask[1] = 0x00;
                    backgroundOrMask[2] = 0x00;
                    backgroundOrMask[3] = 0x00;
                    backgroundOrMask[4] = 0x00;

                    if (element.fontStyle === FontStyleEnum.bold)
                        backgroundOrMask[3] = 0x01;
                    else if (element.fontStyle === FontStyleEnum.italic)
                        backgroundOrMask[3] = 0x02;

                    categoryBytes.add(backgroundOrMask);
                }
                else if (element.background !== undefined)
                {
                    categoryBytes.addInt8(0x01);
                    const bgColor = new Color(element.background);
                    categoryBytes.add(bgColor.ToBytes());
                }
                else 
                {
                    categoryBytes.addInt8(0x00);
                }

                // now add the foreground
                if (element.foreground !== undefined)
                {
                    categoryBytes.addInt8(0x01);
                    const fgColor = new Color(element.foreground);
                    categoryBytes.add(fgColor.ToBytes());
                }
                else 
                {
                    categoryBytes.addInt8(0x00);
                }
            }

            pkgdef.writer.writeLine(`"Data"=hex:${categoryBytes.toString(true)}`);
        }
    }
}