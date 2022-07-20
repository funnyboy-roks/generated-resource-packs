const fs = require('fs');
const path = require('path');
const { sync } = require('zip-local');

const makePackFolder = (name, description) => {
    fs.rmSync(name, {
        recursive: true,
        force: true,
    });
    fs.mkdirSync(`${name}/assets/minecraft/textures`, {
        recursive: true,
    });
    fs.writeFileSync(`${name}/pack.mcmeta`, JSON.stringify({
        pack: {
            pack_format: 9,
            description,
        }
    }, null, 4));
};

const getAllFiles = (srcPath) => {
    const files = fs.readdirSync(srcPath);
    let out = [];
    for(let i = 0; i < files.length; ++i) {
        const file = files[i];
        const src = path.join(srcPath, file);
        if(fs.lstatSync(src).isDirectory()) {
            out = out.concat(getAllFiles(src));
        } else {
            out.push(src);
        }
    }
    return out;
};

const splitPath = (path) => {
    const parts = path.split('/');
    return {
        folder: parts.slice(1, -1).join('/'),
        file: parts[parts.length - 1]
    }
};

const rgba = (bint) => {
    bint = BigInt(bint);
    const a = bint & 0xffn;
    bint >>= 8n;
    const b = bint & 0xffn;
    bint >>= 8n;
    const g = bint & 0xffn;
    bint >>= 8n;
    const r = bint & 0xffn;
    return { r, g, b, a };
}

const rgbToHsv = (bint) => {
    let { r, g, b } = rgba(bint);
    r = Number(r);
    g = Number(g);
    b = Number(b);

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const d = max - min;
    let h, s;
    let v = max;

    v = Math.floor(max / 255 * 100);
    if (max === 0) {
        return [0, 0, 0]
    } else {
        s = Math.floor(d / max * 100);
    }

    if (r === max) {
        h = ( g - b ) / d;
    } else if (g === max) {
        h = 2 + ( b - r ) / d;
    } else {
        h = 4 + ( r - g ) / d;
    }

    h = Math.floor(h * 60);
    if (h < 0) h += 360;

    return { h, s, v };
};

const zip = (folder, deleteFolder) => {
    sync.zip(folder).compress().save(`${folder}.zip`);
    if (deleteFolder) {
        fs.rmSync(folder, {
            recursive: true,
            force: true,
        });
    }
}

module.exports = { makePackFolder, getAllFiles, splitPath, rgba, rgbToHsv, zip };