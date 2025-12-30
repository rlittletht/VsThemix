import { v4 as uuidv4 } from 'uuid';

export class Guid
{
    private m_guid: string[];

    static GuidPartsFromGuid(guid: string): string[]
    {
        const trimmed = guid.trim().replace(/^\{/, '').replace(/\}$/, '');
        const parts = trimmed.split('-');

        if (parts.length !== 5)
            throw new Error(`invalid GUID format: ${guid}. Expected 5 parts separated by hyphens.`);

        const guidRegexes =
            [/^[0-9a-fA-F]{8}$/,
                /^[0-9a-fA-F]{4}$/,
                /^[0-9a-fA-F]{4}$/,
                /^[0-9a-fA-F]{4}$/,
                /^[0-9a-fA-F]{12}$/];

        for (let i = 0; i < parts.length; i++)
        {
            if (!guidRegexes[i].test(parts[i]))
                throw new Error(`invalid GUID format: ${guid}. Part ${i + 1} is invalid: ${parts[i]}`);
        }
        return parts;
    }

    constructor(guidString: string)
    {
        this.m_guid = Guid.GuidPartsFromGuid(guidString);
    }

    ToString(): string
    {
        return `{${this.m_guid.join('-')}}`;
    }

    ToStringReverse(): string
    {
        return this.ToString().split('').reverse().join('');
    }

    static BytesFromHex4(hex: string): Uint8Array
    {
        if (hex.length !== 8)
            throw new Error(`invalid hex length for 4-byte GUID part: ${hex}`);

        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);

        view.setUint32(0, parseInt(hex, 16), true); // little-endian
        return new Uint8Array(buffer);
    }

    static BytesFromHex2(hex: string): Uint8Array
    {
        if (hex.length !== 4)
            throw new Error(`invalid hex length for 2-byte GUID part: ${hex}`);

        const buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);

        view.setUint16(0, parseInt(hex, 16), true); // little-endian
        return new Uint8Array(buffer);
    }

    static BytesFromHexString(hex: string): Uint8Array
    {
        if (hex.length % 2 !== 0)
            throw new Error(`invalid hex string length: ${hex}`);

        const byteLength = hex.length / 2;
        const bytes = new Uint8Array(byteLength);
        for (let i = 0; i < byteLength; i++)
        {
            bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }

        return bytes;
    }

    ToBytes(): Uint8Array
    {
        const bytes = new Uint8Array(16);

        const part1 = Guid.BytesFromHex4(this.m_guid[0]);
        bytes.set(part1, 0);
        const part2 = Guid.BytesFromHex2(this.m_guid[1]);
        bytes.set(part2, 4);
        const part3 = Guid.BytesFromHex2(this.m_guid[2]);
        bytes.set(part3, 6);
        const part4 = Guid.BytesFromHexString(this.m_guid[3]);
        bytes.set(part4, 8);
        const part5 = Guid.BytesFromHexString(this.m_guid[4]);
        bytes.set(part5, 10);

        return bytes;
    }

    ToBytesString(): string
    {
        const bytes = this.ToBytes();
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(',');
    }

    static TestGuidToBytes(guidString: string, expected: Uint8Array, expectedString: string)
    {
        const guid = new Guid(guidString);
        const bytes = guid.ToBytes();

        if (bytes.length !== expected.length)
            throw new Error(`GUID to bytes length mismatch for ${guidString}: expected ${expected.length}, got ${bytes.length}`);

        for (let i = 0; i < bytes.length; i++)
        {
            if (bytes[i] !== expected[i])
                throw new Error(`GUID to bytes mismatch for ${guidString} at index ${i}: expected ${expected[i]}, got ${bytes[i]}`);
        }

        const bytesString = guid.ToBytesString();

        if (bytesString !== expectedString)
            throw new Error(`GUID to bytes string mismatch for ${guidString}: expected ${expectedString}, got ${bytesString}`);
    }

    static DoTestGuidToBytes()
    {
        this.TestGuidToBytes("624ed9c3-bdfd-41fa-96c3-7c824ea32e3d", new Uint8Array([
            0xc3, 0xd9, 0x4e, 0x62,
            0xfd, 0xbd,
            0xfa, 0x41,
            0x96, 0xc3,
            0x7c, 0x82, 0x4e, 0xa3, 0x2e, 0x3d]), "c3,d9,4e,62,fd,bd,fa,41,96,c3,7c,82,4e,a3,2e,3d");
    }

    static RunUnitTests(): void
    {
        this.DoTestGuidToBytes();
    }
    static NewGuid(): Guid
    {
        const guidString = uuidv4();
        return new Guid(guidString);
    }
}