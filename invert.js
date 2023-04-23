import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { makePackFolder, getAllFiles, splitPath, zip, run } from './util.js';

const processImage = async (inPath, outPath) => await Jimp.read(inPath).then(img => img.invert().writeAsync(outPath));

run('Inverted', '§6All Textures are Inverted', processImage);
