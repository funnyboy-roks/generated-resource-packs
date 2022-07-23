const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, rgba, zip } = require('./util');

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            let { r, g, b, a } = rgba(c);
            r = Number(r);
            g = Number(g);
            b = Number(b);
            // a = Number(a);
            
            
            // encodedData =
            const r8 = Math.floor((r / 32)) * 32;
            const g8 = Math.floor((g / 32)) * 32;
            const b8 = Math.floor((b / 32)) * 32;


            const c2 = BigInt(r8 << 16 | g8 << 8 | b8) << 8n | a;
            img.setPixelColour(Number(c2), x, y);
            
        }
    }
    await img.writeAsync(outPath);
}

const run = async () => {
    const files = getAllFiles('./textures');
    const name = '9Bit';
    makePackFolder(name, '§6All Textures are 9-Bit\n§3By: funnyboy_roks');

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