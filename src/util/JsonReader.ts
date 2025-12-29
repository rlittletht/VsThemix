
import fs from 'fs';

export class JsonReader
{
    static ReadJsonFile<T>(fileName: string): T | null
    {
        try
        {
            const serialized: T = JSON.parse(fs.readFileSync(fileName, 'utf8'));

            return serialized;
        }
        catch (e)
        {
            const errString = (e as Error).toString();

            if (errString.indexOf("ENOENT") == -1)
                console.error(`error reading file: ${fileName}: ${errString}`)
            else
                console.error(`can't open file ${fileName}`);
            
            return null;
        }
    }
}
