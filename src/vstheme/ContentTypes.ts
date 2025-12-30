
import { VsixBuilder } from "../util/VsixBuilder";

export class ContentTypes
{
    static AddContentTypesToVsix(builder: VsixBuilder): void
    {
        const contentTypes = builder.AddFile("[Content_Types].xml");

        contentTypes.writer.writeLine(`<?xml version="1.0" encoding="utf-8"?>`);
        contentTypes.writer.writeLine(`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`);
        contentTypes.writer.writeLine(`  <Default Extension="vsixmanifest" ContentType="text/xml" />`);
        contentTypes.writer.writeLine(`  <Default Extension="pkgdef" ContentType="text/plain" />`);
        contentTypes.writer.writeLine(`  <Default Extension="png" ContentType="application/octet-stream" />`);
        contentTypes.writer.writeLine(`  <Default Extension="json" ContentType="application/json" />`);
        contentTypes.writer.writeLine(`</Types>`);
    }
}