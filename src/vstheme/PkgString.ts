import { ByteArray, ByteOrder } from "../util/ByteArray";

export class PkgString
{
    private m_string: string;

    constructor(s: string)
    {
        this.m_string = s;
    }

    ToBytes(): Uint8Array
    {
        // For ASCII, you'll need a custom implementation
        const bytes = new Uint8Array(this.m_string.length + 4);
        for (let i = 0; i < this.m_string.length; i++)
        {
            if (this.m_string.charCodeAt(i) > 127)
            {
                throw new Error("Non-ASCII character detected");
            }
            bytes[i + 4] = this.m_string.charCodeAt(i) & 0x7F; // Mask to 7-bit ASCII
        }

        ByteArray.SetInt32Bytes(bytes, this.m_string.length, ByteOrder.LittleEndian);

        return bytes;
    }
};
