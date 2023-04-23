import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, rgba, zip, run } from './util.js';

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            let { r, g, b, a } = rgba(c);
            r = Number(r);
            g = Number(g);
            b = Number(b);
            // a = Number(a);
            
            
            // encodedData =
            const r8 = r >= 128 ? 255 : 0;
            const g8 = g >= 128 ? 255 : 0;
            const b8 = b >= 128 ? 255 : 0;

            const c2 = BigInt(r8 << 16 | g8 << 8 | b8) << 8n | a;
            img.setPixelColour(Number(c2), x, y);
            
        }
    }
    await img.writeAsync(outPath);
}

run('1Bit', '\u00a76All Textures are 3-bit', processImage);
