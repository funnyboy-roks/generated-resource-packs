const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, zip } = require('./util');

const processImage = async (inPath, outPath) => {
    const img = await Jimp.read(inPath)
    img.resize(
        Math.max(1, Math.floor(img.getWidth() / 4)),
        Math.max(1, Math.floor(img.getHeight() / 4))
        );
    await img.writeAsync(outPath);
}

const run = async () => {
    const files = getAllFiles('./textures2');
    const name = 'Quarter';
    makePackFolder(name, '§6All Textures are 1/4\n§3By: funnyboy_roks');
    // files.splice(0, files.length);
    // files.push('pack.png');
    for(const filePath of files) {
        const {folder, file} = splitPath(filePath);
        console.log(folder + '/' + file);
        const src = path.join('./textures2', folder, file);
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