
import { StringBuilder } from "./StringBuilder.js";

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

    addInt16(word: number, byteOrder: ByteOrder)
    {
        const arr = new Uint8Array(2);
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
        this.m_byteArrays.push(arr);
    }

    addInt32(dword: number, byteOrder: ByteOrder)
    {
        const arr = new Uint8Array(4);
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
        this.m_byteArrays.push(arr);
    }

    toString(): string
    {
        const builder: StringBuilder = new StringBuilder();
        for (const byteArray of this.m_byteArrays)
        {
            for (const byte of byteArray)
            {
                builder.Append(byte.toString(16).padStart(2, '0'));
            }
        }

        return builder.ToString();
    }


    static DoTestUiint8Array(Uint8Arrays: Uint8Array[], expectedString: string)
    {
        const byteArray = new ByteArray();
        for (const arr of Uint8Arrays)
        {
            byteArray.add(arr);
        }
        const resultString = byteArray.toString();
        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
    }

    static TestUint8Arrays()
    {
        this.DoTestUiint8Array([new Uint8Array([0x12, 0x34]), new Uint8Array([0x56, 0x78])], "12345678");
        this.DoTestUiint8Array([new Uint8Array([0xFF]), new Uint8Array([0x00, 0xAB])], "ff00ab");
    }
    
    static DoTestInt8(ints: number[], expectedString: string)
        {
        const byteArray = new ByteArray();
        for (const i of ints)
        {
            byteArray.addInt8(i);
        }

        const resultString = byteArray.toString();
        
        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
    }

    static TestInt8s()
    {
        this.DoTestInt8([0x12, 0x34, 0x56], "123456");
        this.DoTestInt8([0xFF, 0x00, 0xAB], "ff00ab");
    }

    static DoTestInt16(ints: number[], byteOrder: ByteOrder, expectedString: string)
    {
        const byteArray = new ByteArray();
        for (const i of ints)
        {
            byteArray.addInt16(i, byteOrder);
        }
        const resultString = byteArray.toString();
        
        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
    }

    static TestInt16s()
    {
        this.DoTestInt16([0x1234, 0x5678], ByteOrder.LittleEndian, "34127856");
        this.DoTestInt16([0x1234, 0x5678], ByteOrder.BigEndian, "12345678");
    }

    static DoTestInt32(ints: number[], byteOrder: ByteOrder, expectedString: string)
    {
        const byteArray = new ByteArray();
        for (const i of ints)
        {
            byteArray.addInt32(i, byteOrder);
        }

        const resultString = byteArray.toString();
        
        if (resultString !== expectedString)
        {
            throw new Error(`Test failed: expected ${expectedString}, got ${resultString}`);
        }
    }

    static TestInt32s()
    {
        this.DoTestInt32([0x12345678, 0x9ABCDEF0], ByteOrder.LittleEndian, "78563412f0debc9a");
        this.DoTestInt32([0x12345678, 0x9ABCDEF0], ByteOrder.BigEndian, "123456789abcdef0");
    }

    static RunUnitTests(): void
    {
        this.TestUint8Arrays();
        this.TestInt8s()
        this.TestInt16s();
        this.TestInt32s();
    }
}