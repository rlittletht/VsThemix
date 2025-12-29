import { IStreamWriter, StreamWriter } from "./StreamWriter";
const fs = require('fs');

export class VsixFile
{
    private m_filePath: string;
    private m_writer: IStreamWriter;
    private m_content: string[] = [];

    appendLine(line: string): void
    {
        this.m_content.push(line);
    }

    constructor(filePath: string)
    {
        this.m_filePath = filePath;
        this.m_writer = new StreamWriter((line: string) => this.appendLine(line));
    }

    get writer(): IStreamWriter
    {
        return this.m_writer;
    }

    writeToFile(basePath: string): void
    {
        this.m_writer.flush();

        const fullPath = `${basePath}/${this.m_filePath}`;
        const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/'));

        if (!fs.existsSync(dirPath))
        {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(fullPath, this.m_content.join('\n'), 'utf8');
    }
}

export class VsixBuilder
{
    private m_outputPath: string;
    private m_files: VsixFile[] = [];

    constructor(outputPath: string)
    {
        this.m_outputPath = outputPath;
    }

    BuildVsix(): void
    {
        // TODO: build the zip here

        // for now, just create files in the output path
        if (!fs.existsSync(this.m_outputPath))
        {
            fs.mkdirSync(this.m_outputPath, { recursive: true });
        }

        for (const file of this.m_files)
        {
            file.writeToFile(this.m_outputPath);
        }
    }

    AddFile(filePath: string): VsixFile
    {
        const vsixFile = new VsixFile(filePath);
        this.m_files.push(vsixFile);
        return vsixFile;
    }

    get OutputFilename(): string
    {
        return this.m_outputPath;
    }
}