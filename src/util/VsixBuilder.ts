import { IStreamWriter, StreamWriter } from "./StreamWriter";
import path from 'path';
import archiver from 'archiver';

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
        fs.writeFileSync(fullPath, this.m_content.join('\r\n'), 'utf8');
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

    async BuildVsix(dontCleanupTemp: boolean = false): Promise<void>
    {
        const tempDir = path.join(this.m_outputPath, `../temp_vsix_build_${Math.random().toString(36).substring(2, 15)}`);

        // Write files to temp directory first
        if (!fs.existsSync(tempDir))
        {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        for (const file of this.m_files)
        {
            file.writeToFile(tempDir);
        }

        // Create zip archive
        const output = fs.createWriteStream(this.m_outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);
        archive.directory(tempDir, false);
        await archive.finalize();

        // Clean up temp directory
        if (!dontCleanupTemp)
            fs.rmSync(tempDir, { recursive: true, force: true });

        return;
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