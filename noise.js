const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, rgba, zip } = require('./util');


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

const run = async () => {
    const files = getAllFiles('./textures');
    const name = 'Noise';
    makePackFolder(name, '§6All Textures have Noise\n§3By: funnyboy_roks');

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