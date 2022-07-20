const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, rgbToHsv, zip } = require('./util');

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    let pixels = [];
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            if(c & 0xff) {
                pixels.push(BigInt(c));
            }
        }
    }

    pixels = pixels.sort((a, b) => Number(rgbToHsv(a).v - rgbToHsv(b).v));

    for (let y = 0; y < img.getHeight(); ++y) {
        for (let x = 0; x < img.getWidth(); ++x) {
            if (img.getPixelColour(x, y) & 0xff) {
                img.setPixelColour(Number(pixels.shift()), x, y);
            }
        }
    }
    await img.writeAsync(outPath);
}

const run = async () => {
    const files = getAllFiles('./textures');
    const name = 'Sorted';
    makePackFolder(name, '§6All Textures are Sorted\n§3By: funnyboy_roks');

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