#!/bin/bash

# example invocation
#./generateBMAP.sh /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/Yaml-1.1.0-1324+57605d1 /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/yaml-parser /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/bmapIncludesSpec.json /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/generated-bmap /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/bmapIncludesSpec.json

echo "Path to the BMAP yaml root directory"
echo $1
echo ""

echo "Path to the BMAP Yaml Parser Project"
echo $2
echo ""

echo "Path to the bmapIncludesSpecPath"
echo $3
echo ""

echo "Path to the directory where the project writes the generated BMAP files"
echo $4
echo ""

cd $1
find . -type f | xargs sed -i '' 's/!include/#####/g'
find . -type f | xargs sed -i '' 's/!File/#####/g'

cd $2
node ./bin/cli.js parseYaml --yamlInputDirectory=$1 --bmapOutputDirectory=$4 --bmapIncludesSpecPath=$5
#./generateBMAP.sh /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/Yaml-1.1.0-1324+57605d1 /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/yaml-parser /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/bmapIncludesSpec.json /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/generated-bmap /Users/tedshaffer/Documents/Miscellaneous/Bose/BMAP/bmapGenerator/bmapIncludesSpec.json
