import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, rgba, zip, run } from './util.js';

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            const { r, g, b, a } = rgba(c);
            const sum = r + g + b;
            // if (a) {
                // sum = r + g + b;
            // }

            const avg = sum / 3n >= 128n ? 255n : 0n;
            const c2 = (avg << 24n) | (avg << 16n) | (avg << 8n) | a;
            img.setPixelColour(Number(c2), x, y);
            
        }
    }
    await img.writeAsync(outPath);
}

run('Black and White', '§6All Textures are B&W', processImage);
