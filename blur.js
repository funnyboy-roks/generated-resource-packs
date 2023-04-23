import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, zip, run } from './util.js';

const processImage = async (inPath, outPath) => await Jimp.read(inPath).then(img => img.gaussian(5).writeAsync(outPath));

run('Blur', '\u00a7All Textures are Blurred', processImage);
