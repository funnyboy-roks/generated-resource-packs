const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, rgba, zip } = require('./util');

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
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

const run = async () => {
    const files = getAllFiles('./textures');
    const name = 'Average';
    makePackFolder(name, '§6Average Colour of Textures\n§3By: funnyboy_roks');

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