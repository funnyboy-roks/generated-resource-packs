import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, rgba, zip, distSq } from './util.js';

const mcColours = {
    0x000000: rgba(0x00000000),
    0x0000aa: rgba(0x0000aa00),
    0x00aa00: rgba(0x00aa0000),
    0x00aaaa: rgba(0x00aaaa00),
    0xaa0000: rgba(0xaa000000),
    0xaa00aa: rgba(0xaa00aa00),
    0xffaa00: rgba(0xffaa0000),
    0xaaaaaa: rgba(0xaaaaaa00),
    0x555555: rgba(0x55555500),
    0x5555ff: rgba(0x5555ff00),
    0x55ff55: rgba(0x55ff5500),
    0xff5555: rgba(0xff555500),
    0xff55ff: rgba(0xff55ff00),
    0xffff55: rgba(0xffff5500),
    0xffffff: rgba(0xffffff00),
};
console.log(mcColours);

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            const { r, g, b, a } = rgba(c);
            let min = Infinity;
            let col = 0;
            for([k, v] of Object.entries(mcColours)) {
                const d = distSq({ r, g, b }, v);
                if (d < min) {
                    min = d;
                    col = k;
                }
            }

            const c2 = BigInt(col) << 8n | a;
            img.setPixelColour(Number(c2), x, y);
            
        }
    }
    await img.writeAsync(outPath);
}

run('MCCols', '§6All Textures are 1-bit', processImage);
