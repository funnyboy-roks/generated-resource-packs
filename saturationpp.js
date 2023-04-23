import { rgba, pixelMap, run, rgbToHsv, hsvToRgb } from './util.js';

const processImage = async (inPath, outPath) => {
    await pixelMap(inPath, outPath, (x, y, c) => {
        let { r, g, b, a } = rgba(c);
        
        r = Number(r);
        g = Number(g);
        b = Number(b);

        if (a) {
            //
            // let avg = Math.floor(Number(r + g + b) / 3);
            // avg /= 255;
            // let rgb = hsvToRgb(avg, 1, 1);
            // r = rgb.r;
            // g = rgb.g;
            // b = rgb.b;
            //

            let hsv = rgbToHsv({ r, g, b });

            hsv.s = Math.min(hsv.s * 2.0, 1);

            let rgb = hsvToRgb(hsv);

            r = rgb.r;
            g = rgb.g;
            b = rgb.b;

        }

        //return toBigInt({ r, g, b, a });
        return BigInt(r << 16 | g << 8 | b) << 8n | a;
    });
}

run('Saturation++', '\u00a76Saturates all textures', processImage);
