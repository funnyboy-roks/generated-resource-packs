#!/bin/sh

mkdir unzip_TMP
cd unzip_TMP
unzip "../$1"
cp -r ./assets/minecraft/textures ../
cp ./pack.png ..
cd ..
rm -r textures/font
rm -r unzip_TMP