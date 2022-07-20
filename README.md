# Resourcepacks

Simple scripts to generate fancy resource packs

## Running

Before you can run any of the scripts, you need to do

```
npm i
```

To generate a type of resource pack, run one of the scripts with node.

```sh
node <script> [zip]
```

### Scripts

- average.js - Use the average colour of each texture file (ignoring alpha=0 pixels)
- greyscale.js - Convert each image to greyscale
- invert.js - Invert the colour of each image
- noise.js - Add noise to each pixel
- sorted.js - Sort each pixel by value

### Run all scripts with `./full.sh`, which will zip them

## Textures

Getting the textures directory requires the vanilla jar.  You can get this from the `.minecraft` folder at `/versions/<version>/<version>.jar`

Run the `get-textures.sh` script with the jar name to get the textures:

```sh
./get-textures.sh 1.19.jar
```
