#!/usr/bin/env bash

rm -rf ./bin/com.errnull.SVGAConverter_FL

mkdir ./bin/com.errnull.SVGAConverter_FL

cp -r ./Converter/ ./bin/com.errnull.SVGAConverter_FL

zip ./bin/com.errnull.SVGAConverter_FL/src/assets/SVGA-FLConveter.apr ./SVGA-FLConveter.xml
zip ./bin/com.errnull.SVGAConverter_FL/src/assets/SVGA-FLConveter.apr ./SVGA-FLConveter.html

rm ./bin/SVGAConverter_FL.zxp

cd ./ZXPSignCmd/

./ZXPSignCmd  -sign  "../bin/com.errnull.SVGAConverter_FL"  "../bin/SVGAConverter_FL.zxp"  "./errnull.p12"  "zhan"

cp -f ../bin/SVGAConverter_FL.zxp ../windows

cp -f ../bin/SVGAConverter_FL.zxp ../mac

rm -rf ../bin/com.errnull.SVGAConverter_FL