import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, rgbToHsv, zip, distSq, rgba, toBigInt, run } from './util.js';

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    let pixels = [];
    let [r, g, b] = [0n, 0n, 0n];
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = rgba(img.getPixelColour(x, y));
            if (c.a) {
                pixels.push(c);
                r += c.r;
                g += c.g;
                b += c.b;
            }
        }
    }
    
    if (pixels.length) {
        r /= BigInt(pixels.length);
        g /= BigInt(pixels.length);
        b /= BigInt(pixels.length);
    }

    // pixels = pixels.sort((a, b) => Number(rgbToHsv(a).v - rgbToHsv(b).v));
    pixels = pixels.sort((a, c) => distSq(a, {r, g, b}) - distSq(c, {r, g, b}));

    for (let y = 0; y < img.getHeight(); ++y) {
        for (let x = 0; x < img.getWidth(); ++x) {
            if (img.getPixelColour(x, y) & 0xff) {
                img.setPixelColour(Number(toBigInt(pixels.shift())), x, y);
            }
        }
    }
    await img.writeAsync(outPath);
}

run('Sorted', '§6All Textures are Sorted', processImage);
