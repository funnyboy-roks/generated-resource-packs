import { rgba, pixelMap, run } from './util.js';

const processImage = async (inPath, outPath) => {
    await pixelMap(inPath, outPath, (x, y, c) => {
        const { r, g, b, a } = rgba(c);
        const sum = r + g + b;
        // if (a) {
            // sum = r + g + b;
        // }

        const avg = sum / 3n;
        return (avg << 24n) | (avg << 16n) | (avg << 8n) | a;
    });
}

run('Greyscale', '\u00a77All Textures are Greyscale', processImage);
