import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, zip, run } from './util.js';

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    img.resize(
        Math.max(1, Math.floor(img.getWidth() / 4)),
        Math.max(1, Math.floor(img.getHeight() / 4))
        );
    await img.writeAsync(outPath);
}

run('Quarter', '§6All Textures are 1/4', processImage);
