#!/bin/sh

files=$(ls "$(pwd)" | grep '.js$' | grep -v 'util')
for file in $files; do
    echo "$file"
    node "$file" zip | awk "{print \"$file - \"\$0}"
done
