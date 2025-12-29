
export class Color
{
    private m_rgba: { r: number; g: number; b: number; a: number; } = { r: 0, g: 0, b: 0, a: 255 };

    constructor(rgba: string)
    {
        if (rgba.startsWith("#"))
            rgba = rgba.substring(1);

        if (rgba.length != 6 && rgba.length != 8)
            throw new Error(`invalid color format: ${rgba}. Expected 6 (RRGGBB) or 8 (RRGGBBAA) hex digits.`);

        this.m_rgba.r = parseInt(rgba.substring(0, 2), 16);
        this.m_rgba.g = parseInt(rgba.substring(2, 4), 16);
        this.m_rgba.b = parseInt(rgba.substring(4, 6), 16);
        this.m_rgba.a = (rgba.length === 8) ? parseInt(rgba.substring(6, 8), 16) : 255;
    }

    ToBytes(): Uint8Array
    {
        const bytes = new Uint8Array(4);
        bytes[0] = this.m_rgba.r & 0xFF;
        bytes[1] = this.m_rgba.g & 0xFF;
        bytes[2] = this.m_rgba.b & 0xFF;
        bytes[3] = this.m_rgba.a & 0xFF;
        return bytes;
    }
}