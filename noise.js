import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, rgba, zip, run } from './util.js';


const constrain = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
}

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            let { r, g, b, a } = rgba(c);
            if (!a) continue;
            
            r = BigInt(constrain(Number(r) + (Math.floor(Math.random() * 50) - 25), 0, 255));
            g = BigInt(constrain(Number(g) + (Math.floor(Math.random() * 50) - 25), 0, 255));
            b = BigInt(constrain(Number(b) + (Math.floor(Math.random() * 50) - 25), 0, 255));
            a = BigInt(constrain(Number(a) + (Math.floor(Math.random() * 50) - 25), 0, 255));

            img.setPixelColour(Number(r << 24n | g << 16n | b << 8n | a), x, y);
            
        }
    }
    await img.writeAsync(outPath);
}

run('Noise', '§6All Textures have Noise', processImage);
