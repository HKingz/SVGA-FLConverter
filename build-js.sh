#!/usr/bin/env bash

rm -rf ./bin/com.errnull.SVGAConverter_FL

mkdir ./bin/com.errnull.SVGAConverter_FL

cp -r ./Converter/ ./bin/com.errnull.SVGAConverter_FL

cat ./Conveter_apr.txt ./dist/js/main.js ./EndLine_apr.txt> ./SVGA-FLConveter.html

./encode SVGA-FLConveter.html

zip ./bin/com.errnull.SVGAConverter_FL/src/assets/SVGA-FLConveter.apr ./SVGA-FLConveter.xml
zip ./bin/com.errnull.SVGAConverter_FL/src/assets/SVGA-FLConveter.apr ./SVGA-FLConveter.html

rm ./SVGA-FLConveter.html
rm ./bin/SVGAConverter_FL.zxp

cd ./ZXPSignCmd/

./ZXPSignCmd  -sign  "../bin/com.errnull.SVGAConverter_FL"  "../bin/SVGAConverter_FL.zxp"  "./errnull.p12"  "zhan"

cp -f ../bin/SVGAConverter_FL.zxp ../mac
cp -f ../bin/SVGAConverter_FL.zxp ../windows

cd ../windows/
mkdir ./SVGAConverter_FL
cp -f ../install.bat ./SVGAConverter_FL
cp -f ../modify.reg ./SVGAConverter_FL
unzip -o -d ./SVGAConverter_FL/sources/ ./SVGAConverter_FL.zxp
zip -r ./SVGAConverter_FL.zip ./SVGAConverter_FL/*

rm -rf ./SVGAConverter_FL
rm -rf ../bin/com.errnull.SVGAConverter_FL