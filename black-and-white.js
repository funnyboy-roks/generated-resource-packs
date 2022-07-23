const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, rgba, zip } = require('./util');

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            const { r, g, b, a } = rgba(c);
            const sum = r + g + b;
            // if (a) {
                // sum = r + g + b;
            // }

            const avg = sum / 3n >= 128n ? 255n : 0n;
            const c2 = (avg << 24n) | (avg << 16n) | (avg << 8n) | a;
            img.setPixelColour(Number(c2), x, y);
            
        }
    }
    await img.writeAsync(outPath);
}

const run = async () => {
    const files = getAllFiles('./textures');
    const name = 'Black and White';
    makePackFolder(name, '§6All Textures are B&W\n§3By: funnyboy_roks');

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