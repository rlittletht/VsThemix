import { StringBuilder } from "./StringBuilder";

interface OutputLineDelegate
{
    (s: string): void;
}

export interface IStreamWriter
{
    write(s: string): void;
    writeLine(s: string): void;
    flush(): void;
}

export class GenericStreamWriter implements IStreamWriter
{
    private m_streamWriter: IStreamWriter;

    constructor(writer: IStreamWriter)
    {
        this.m_streamWriter = writer;
    }

    write(s: string): void
    {
        this.m_streamWriter.write(s);
    }

    writeLine(s: string): void
    {
        this.m_streamWriter.writeLine(s);
    }

    flush(): void
    {
        this.m_streamWriter.flush();
    }
}

export class StreamWriter implements IStreamWriter
{
    private m_buffer: StringBuilder = new StringBuilder();
    private m_outputDelegate: OutputLineDelegate;

    constructor(del: OutputLineDelegate)
    {
        this.m_outputDelegate = del;
    }

    write(s: string): void
    {
        let i = 0;
        let ichLine;

        while ((ichLine = s.indexOf("\n", i)) != -1)
        {
            this.m_buffer.Append(s.substring(i, ichLine))
            this.m_outputDelegate(this.m_buffer.ToString());
            this.m_buffer.Clear();

            i = ichLine + 1;
        }

        this.m_buffer.Append(s.substring(i, i + s.length));
    }

    writeLine(s: string): void
    {
        this.write(s);
        this.write("\n");
        this.m_buffer.Clear();
    }

    flush(): void
    {
        if (!this.m_buffer.IsEmpty)
            this.writeLine("");
    }
}