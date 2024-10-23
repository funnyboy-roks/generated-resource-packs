import fs from 'fs';
import path from 'path';
import zl from 'zip-local';
import Jimp from 'jimp';
const { sync } = zl;

export const makePackFolder = (name, description) => {
    fs.rmSync(name, {
        recursive: true,
        force: true,
    });
    fs.mkdirSync(`${name}/assets/minecraft/textures`, {
        recursive: true,
    });
    fs.writeFileSync(`${name}/pack.mcmeta`, JSON.stringify({
        pack: {
            pack_format: 42,
            supported_versions: {
                min_inclusive: 3,
                max_inclusive: 42,
            },
            description,
        }
    }, null, 4));
};

export const getAllFiles = (srcPath) => {
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

export const splitPath = (path) => {
    const parts = path.split('/');
    return {
        folder: parts.slice(1, -1).join('/'),
        file: parts[parts.length - 1]
    }
};

export const rgba = (bint) => {
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

// export const rgbToHsv = (bint) => {
//     let { r, g, b } = rgba(bint);
//     r = Number(r);
//     g = Number(g);
//     b = Number(b);
// 
//     const min = Math.min(r, g, b);
//     const max = Math.max(r, g, b);
//     const d = max - min;
//     let h, s;
//     let v = max;
// 
//     v = Math.floor(max / 255 * 100);
//     if (max === 0) {
//         return [0, 0, 0]
//     } else {
//         s = Math.floor(d / max * 100);
//     }
// 
//     if (r === max) {
//         h = ( g - b ) / d;
//     } else if (g === max) {
//         h = 2 + ( b - r ) / d;
//     } else {
//         h = 4 + ( r - g ) / d;
//     }
// 
//     h = Math.floor(h * 60);
//     if (h < 0) h += 360;
// 
//     return { h, s, v };
// };

export const rgbToHsv = ({r, g, b}) => {
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;
    let s = (max === 0 ? 0 : d / max);
    let v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return { h, s, v };
}

export const hsvToRgb = ({h, s, v})  => { // https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    let r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export const zip = (folder, deleteFolder) => {
    sync.zip(folder).compress().save(`${folder}.zip`);
    if (deleteFolder) {
        fs.rmSync(folder, {
            recursive: true,
            force: true,
        });
    }
}

/**
 * 
 * @param {{r: Number|BigInt, g: Number|BigInt, b: Number|BigInt}} a 
 * @param {{r: Number|BigInt, g: Number|BigInt, b: Number|BigInt}} b
 */
export const distSq = (a, b) => {

    return (Number(a.r) - Number(b.r)) ** 2 +
        (Number(a.g) - Number(b.g)) ** 2 +
        (Number(a.b) - Number(b.b)) ** 2;

}

/**
 * 
 * @param {{r: Number|BigInt, g: Number|BigInt, b: Number|BigInt}} a 
 * @param {{r: Number|BigInt, g: Number|BigInt, b: Number|BigInt}} b
 */
export const dist = (a, b) => {

    return Math.sqrt(distSq(a, b));

}

/**
 * 
 * @param {{r: Number|BigInt, g: Number|BigInt, b: Number|BigInt}} a
 */
export const toBigInt = (a) => {
    return BigInt(a.r) << 24n | BigInt(a.g) << 16n | BigInt(a.b) << 8n | BigInt(a.a || 255);
}

/**
 * 
 * @param {{r: Number|BigInt, g: Number|BigInt, b: Number|BigInt}} a
 */
export const toNum = (a) => {
	return Number(toBigInt(a));
}

/**
 * 
 * @param {string} inPath
 * @param {string} outPath
 * @param {(x: Number, y: Number, c: BigInt) => BigInt} fn
 */
export const pixelMap = async (inPath, outPath, fn) =>  {
    const img = await Jimp.read(inPath)
    for (let x = 0; x < img.getWidth(); ++x) {
        for (let y = 0; y < img.getHeight(); ++y) {
            let c = img.getPixelColour(x, y);
            img.setPixelColour(Number(fn(x, y, BigInt(c))), x, y);
        }
    }
    await img.writeAsync(outPath);
}

export const run = async (name, desc, processImage) => {
    const files = getAllFiles('./textures');
    makePackFolder(name, `${desc}\n§3By: funnyboy_roks`);

    for (const filePath of files) {
        const { folder, file } = splitPath(filePath);
        //console.log(`${name} - ${folder}/${file}`);

        const src = path.join('textures', folder, file);
        const dest = file === 'pack.png'
            ? path.join(name, folder, file)
            : path.join(name, 'assets/minecraft/textures', folder, file);

        if (src.endsWith('.png')) {
            await processImage(src, dest);
        } else if (!fs.lstatSync(src).isDirectory()) {
            fs.copyFileSync(src, dest);
        }
    }
    if (process.argv[2] === 'zip') {
        console.log('Zipping...');
        zip(name, true);
    }
};
