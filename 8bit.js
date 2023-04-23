import { rgba, pixelMap, run } from './util.js';

const processImage = async (inPath, outPath) => {
    await pixelMap(inPath, outPath, (x, y, c) => {
        let { r, g, b, a } = rgba(c);
        r = Number(r);
        g = Number(g);
        b = Number(b);

        const r8 = Math.floor((r / 32)) * 32;
        const g8 = Math.floor((g / 32)) * 32;
        const b8 = Math.floor((b / 64)) * 64;

        return BigInt(r8 << 16 | g8 << 8 | b8) << 8n | a;
    })
}

run('8Bit', '\u00a76All textures are 8-bit', processImage);
