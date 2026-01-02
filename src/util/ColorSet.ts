
import { Color } from "./Color";

export class ColorSet
{
    private m_usedColors: Set<string> = new Set<string>();

    private joinArgbHex8(a: number, r: number, g: number, b: number): string
    {
        return `${a.toString(16).padStart(2, '0')}${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    private clampByte(x: number): number
    {
        if (x < 0) return 0;
        if (x > 255) return 255;
        return x;
    }

    private getEuclideanSq(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number
    {
        const dr = r1 - r2;
        const dg = g1 - g2;
        const db = b1 - b2;
        return dr * dr + dg * dg + db * db;
    }

    private findClosestUnusedColor(target: Color): Color
    {
        const targetKey = target.ToStringNoAlpha();

        if (!this.m_usedColors.has(targetKey))
        {
            return target;
        }

        // create a set of permutations to try
        const dirs: [number, number, number][] = [];
        for (let dx = -1; dx <= 1; dx++)
        {
            for (let dy = -1; dy <= 1; dy++)
            {
                for (let dz = -1; dz <= 1; dz++)
                {
                    if (dx === 0 && dy === 0 && dz === 0) continue;
                    dirs.push([dx, dy, dz]);
                }
            }
        }

        let best: Color | null = null;
        let bestDist = Number.MAX_VALUE;

        for (let rad = 1; rad <= 255; rad++)
        {
            for (const d of dirs)
            {
                const tryColor = new Color(this.clampByte(target.R + rad * d[0]), this.clampByte(target.G + rad * d[1]), this.clampByte(target.B + rad * d[2]));
                const key = tryColor.ToStringNoAlpha();

                if (this.m_usedColors.has(key))
                    continue;

                const dist = this.getEuclideanSq(tryColor.R, tryColor.G, tryColor.B, target.R, target.G, target.B);
                if (dist < bestDist)
                {
                    bestDist = dist;
                    best = tryColor;
                }
            }

            if (best)
                break;
        }

        if (!best)
        {
            throw new Error("Failed to find an unused color.");
        }
        return best;
    }

    GetUniqueColor(color: Color): Color
    {
        const uniqueColor = this.findClosestUnusedColor(color);
        const key = uniqueColor.ToStringNoAlpha();
        this.m_usedColors.add(key);
        return uniqueColor;
    }

    GetUniqueColorString(colorStr: string): string
    {
        const color = new Color(colorStr);
        return this.GetUniqueColor(color).ToString();
    }

    static DoFindClosestUnusedColorTest(colors: string[], expected: string[])
    {
        const colorSet = new ColorSet();
        const results: string[] = [];

        for (const colorStr of colors)
        {
            const color = new Color(colorStr);
            const uniqueColor = colorSet.GetUniqueColor(color);
            results.push(uniqueColor.ToString());
        }
        console.assert(results.length === expected.length, `Expected ${expected.length} results, got ${results.length}`);
        for (let i = 0; i < results.length; i++)
        {
            if(results[i] !== expected[i])
            {
                throw new Error(`Expected ${expected[i]}, got ${results[i]}`);
            }
        }
    }

    static UnitTest_FindClosestUnusedColor_OneColor()
    {
        ColorSet.DoFindClosestUnusedColorTest(
            ["#112233FF"],
            ["#112233FF"]
        );
    }

    static UnitTest_FindClosestUnusedColor_TwoColors()
    {
        ColorSet.DoFindClosestUnusedColorTest(
            ["#112233FF", "#112233FF"],
            ["#112233FF", "#102233FF"]
        );
    }

    static UnitTest_FindClosestUnusedColor_MultipleColors()
    {
        ColorSet.DoFindClosestUnusedColorTest(
            ["#112233FF", "#112233FF", "#112233FF", "#112233FF", "#112233FF", "#112233FF"],
            ["#112233FF", "#102233FF", "#112133FF", "#112232FF", "#112234FF", "#112333FF"]
        );
    }

    static RunAllUnitTests()
    {
        ColorSet.UnitTest_FindClosestUnusedColor_OneColor();
        ColorSet.UnitTest_FindClosestUnusedColor_TwoColors();
        ColorSet.UnitTest_FindClosestUnusedColor_MultipleColors();
    }
}