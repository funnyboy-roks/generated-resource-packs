const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { makePackFolder, getAllFiles, splitPath, zip } = require('./util');

const processImage = async (inPath, outPath) => await Jimp.read(inPath).then(img => img.gaussian(5).writeAsync(outPath));

const run = async () => {
    const files = getAllFiles('./textures');
    const name = 'Blur';
    makePackFolder(name, '§6All Textures are Blurred\n§3By: funnyboy_roks');

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