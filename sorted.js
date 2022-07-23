const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, rgbToHsv, zip, distSq, rgba, toBigInt } = require('./util');

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    let pixels = [];
    let r = g = b = 0n;
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

const run = async () => {
    const files = getAllFiles('./textures');
    const name = 'Sorted';
    makePackFolder(name, '§6All Textures are Sorted\n§3By: funnyboy_roks');
    // files.splice(0, files.length);
    // files.push('pack.png');

    for(const filePath of files) {
        const {folder, file} = splitPath(filePath);
        console.log(folder + '/' + file);
        const src = path.join('./textures', folder, file);
        const dest = file === 'pack.png' ? path.join(`./${name}`, folder, file) : path.join(`./${name}/assets/minecraft/textures`, folder, file);

        if(src.endsWith('.png')) {
            await processImage(src, dest);
        } else {
            if(!fs.lstatSync(src).isDirectory()){
                fs.copyFileSync(src, dest);
            }
        }

    }
    if (process.argv[2] === 'zip') {
        console.log('Zipping...');
        zip(name, true);
    }
};

run();