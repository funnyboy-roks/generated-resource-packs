#!/bin/sh

files=$(ls "$(pwd)" | grep '.js$' | grep -v 'util')
echo "printing files: $files"
for file in $files; do
    node "$file" zip | awk "{print \"$file - \"\$0}"
done
