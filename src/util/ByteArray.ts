
import { StringBuilder } from "./StringBuilder";

export enum ByteOrder
{
    LittleEndian,
    BigEndian
}

export class ByteArray
{
    private m_byteArrays: Uint8Array[] = [];

    add(bytes: Uint8Array)
    {
        this.m_byteArrays.push(bytes);
    }

    addInt8(byte: number)
    {
        const arr = new Uint8Array(1);
        arr[0] = byte & 0xFF;
        this.m_byteArrays.push(arr);
    }

    static SetInt16Bytes(arr: Uint8Array, word: number, byteOrder: ByteOrder)
    {
        if (byteOrder === ByteOrder.LittleEndian)
        {
            arr[0] = word & 0xFF;
            arr[1] = (word >> 8) & 0xFF;
        }
        else
        {
            arr[1] = word & 0xFF;
            arr[0] = (word >> 8) & 0xFF;
        }
    }

    addInt16(word: number, byteOrder: ByteOrder)
    {
        const arr = new Uint8Array(2);
        ByteArray.SetInt16Bytes(arr, word, byteOrder);
        this.m_byteArrays.push(arr);
    }

    static SetInt32Bytes(arr: Uint8Array, dword: number, byteOrder: ByteOrder)
    {
        if (byteOrder === ByteOrder.LittleEndian)
        {
            arr[0] = dword & 0xFF;
            arr[1] = (dword >> 8) & 0xFF;
            arr[2] = (dword >> 16) & 0xFF;
            arr[3] = (dword >> 24) & 0xFF;
        }
        else
        {
            arr[3] = dword & 0xFF;
            arr[2] = (dword >> 8) & 0xFF;
            arr[1] = (dword >> 16) & 0xFF;
            arr[0] = (dword >> 24) & 0xFF;
        }
    }

    addInt32(dword: number, byteOrder: ByteOrder)
    {
        const arr = new Uint8Array(4);
        ByteArray.SetInt32Bytes(arr, dword, byteOrder);
        this.m_byteArrays.push(arr);
    }

    toString(prefixEncodeLength: boolean = false): string
    {
        const builder: StringBuilder = new StringBuilder();
        let first = true;

        if (prefixEncodeLength)
        {
            const totalLength = this.m_byteArrays.reduce((sum, arr) => sum + arr.length, 0);
            const lengthArray = new Uint8Array(4);

            // length includes the lenght byte
            ByteArray.SetInt32Bytes(lengthArray, totalLength + 4, ByteOrder.LittleEndian);
            this.m_byteArrays.unshift(lengthArray);
        }

        for (const byteArray of this.m_byteArrays)
        {
            for (const byte of byteArray)
            {
                if (!first)
                {
                    builder.Append(",");
                }
                builder.Append(byte.toString(16).padStart(2, '0'));
                first = false;
            }
        }

        return builder.ToString();
    }


    static DoTestUint8Array(Uint8Arrays: Uint8Array[], expectedString: string, expectedPrefixString: string)
    {
        const byteArray = new ByteArray();
        for (const arr of Uint8Arrays)
        {
            byteArray.add(arr);
        }
        const resultString = byteArray.toString();
        const resultStringPrefix = byteArray.toString(true);

        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }

        if (resultStringPrefix.substring(expectedPrefixString.length) !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultStringPrefix.substring(expectedPrefixString.length)}`);
        }

        if (resultStringPrefix.substring(0, expectedPrefixString.length) !== expectedPrefixString)
        {
            throw new Error(`Test failed: expected ${expectedPrefixString}, got ${resultStringPrefix.substring(0, expectedPrefixString.length)}`);
        }
    }

    static TestUint8Arrays()
    {
        this.DoTestUint8Array([new Uint8Array([0x12, 0x34]), new Uint8Array([0x56, 0x78])], "12,34,56,78", "08,00,00,00,");
        this.DoTestUint8Array([new Uint8Array([0xFF]), new Uint8Array([0x00, 0xAB])], "ff,00,ab", "07,00,00,00,");
    }

    static DoTestInt8(ints: number[], expectedString: string, expectedPrefixString: string)
    {
        const byteArray = new ByteArray();
        for (const i of ints)
        {
            byteArray.addInt8(i);
        }

        const resultString = byteArray.toString();
        const resultStringPrefix = byteArray.toString(true);

        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
        if (resultStringPrefix.substring(expectedPrefixString.length) !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultStringPrefix.substring(expectedPrefixString.length)}`);
        }
        if (resultStringPrefix.substring(0, expectedPrefixString.length) !== expectedPrefixString)
        {
            throw new Error(`Test failed: expected ${expectedPrefixString}, got ${resultStringPrefix.substring(0, expectedPrefixString.length)}`);
        }
    }

    static TestInt8s()
    {
        this.DoTestInt8([0x12, 0x34, 0x56], "12,34,56", "07,00,00,00,");
        this.DoTestInt8([0xFF, 0x00, 0xAB], "ff,00,ab", "07,00,00,00,");
    }

    static DoTestInt16(ints: number[], byteOrder: ByteOrder, expectedString: string, expectedPrefixString: string)
    {
        const byteArray = new ByteArray();
        for (const i of ints)
        {
            byteArray.addInt16(i, byteOrder);
        }
        const resultString = byteArray.toString();
        const resultStringPrefix = byteArray.toString(true);

        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
        if (resultStringPrefix.substring(expectedPrefixString.length) !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultStringPrefix.substring(expectedPrefixString.length)}`);
        }
        if (resultStringPrefix.substring(0, expectedPrefixString.length) !== expectedPrefixString)
        {
            throw new Error(`Test failed: expected ${expectedPrefixString}, got ${resultStringPrefix.substring(0, expectedPrefixString.length)}`);
        }
    }

    static TestInt16s()
    {
        this.DoTestInt16([0x1234, 0x5678], ByteOrder.LittleEndian, "34,12,78,56", "08,00,00,00,");
        this.DoTestInt16([0x1234, 0x5678], ByteOrder.BigEndian, "12,34,56,78", "08,00,00,00,");
    }

    static DoTestInt32(ints: number[], byteOrder: ByteOrder, expectedString: string, expectedPrefixString: string)
    {
        const byteArray = new ByteArray();
        for (const i of ints)
        {
            byteArray.addInt32(i, byteOrder);
        }

        const resultString = byteArray.toString();
        const resultStringPrefix = byteArray.toString(true);

        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
        if (resultStringPrefix.substring(expectedPrefixString.length) !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultStringPrefix.substring(expectedPrefixString.length)}`);
        }
        if (resultStringPrefix.substring(0, expectedPrefixString.length) !== expectedPrefixString)
        {
            throw new Error(`Test failed: expected ${expectedPrefixString}, got ${resultStringPrefix.substring(0, expectedPrefixString.length)}`);
        }
    }

    static TestInt32s()
    {
        this.DoTestInt32([0x12345678, 0x9ABCDEF0], ByteOrder.LittleEndian, "78,56,34,12,f0,de,bc,9a", "0c,00,00,00,");
        this.DoTestInt32([0x12345678, 0x9ABCDEF0], ByteOrder.BigEndian, "12,34,56,78,9a,bc,de,f0", "0c,00,00,00,");
    }

    static RunUnitTests(): void
    {
        this.TestUint8Arrays();
        this.TestInt8s()
        this.TestInt16s();
        this.TestInt32s();
    }
}