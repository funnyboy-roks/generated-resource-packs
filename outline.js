import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, zip, toBigInt, rgba } from './util.js';

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    const [width, height] = [img.getWidth(), img.getHeight()];

    let r = g = b = a = pxs = 0n;
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
    const col = Number(toBigInt({r, g, b, a}));

    const out = img.clone();
    for(let x = 0; x < width; ++x) {
        for(let y = 0; y < height; ++y) {


            if(!(img.getPixelColour(x, y) & 0xff)) {
                continue;
            }

            if (x * y === 0 || x === width - 1 || y === height - 1) {
                out.setPixelColour(col, x, y);
                continue;
            }


            if (
                // !(img.getPixelColour(x - 1, y - 1) & 0xff) ||
                !(img.getPixelColour(x    , y - 1) & 0xff) ||
                // !(img.getPixelColour(x + 1, y - 1) & 0xff) ||

                !(img.getPixelColour(x - 1, y    ) & 0xff) ||
                !(img.getPixelColour(x + 1, y    ) & 0xff) ||

                // !(img.getPixelColour(x - 1, y + 1) & 0xff) ||
                !(img.getPixelColour(x    , y + 1) & 0xff)
                // !(img.getPixelColour(x + 1, y + 1) & 0xff)
            ) {

                out.setPixelColour(col, x, y);
                continue;
            }

        }
    }

    await out.writeAsync(outPath);
}

run('Outline', '§6All Textures are 1/4', processImage);
