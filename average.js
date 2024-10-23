import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, rgba, zip, run } from './util.js';

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    let r;
    let g;
    let b;
    let a;
    let pxs;
    r = g = b = a = pxs = 0n;
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            if (c & 0xff) {
                const co = rgba(c);
                r += co.r;
                g += co.g;
                b += co.b;
                a += co.a;
                ++pxs;
            }

        }
    }

    if(pxs > 0) {
        r /= pxs;
        g /= pxs;
        b /= pxs;
        a /= pxs;
    } else {
        r = g = b = a = 0n;
    }

    const c = Number((r << 24n) | (g << 16n) | (b << 8n) | a)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            if (img.getPixelColour(x, y) & 0xff) {
                img.setPixelColour(c, x, y);
            }
        }
    }
    await img.writeAsync(outPath);
}

run('Average', '§6Average Colour of Textures', processImage);
