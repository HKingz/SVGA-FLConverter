regedit /s ./others\modify.reg

del /s/q "C:\Program Files\Common Files\Adobe\CEP\extensions\com.errnull.SVGAConverter_FL"

mkdir "C:\Program Files\Common Files\Adobe\CEP\extensions\com.errnull.SVGAConverter_FL"

xcopy/s/q .\sources\*  "C:\Program Files\Common Files\Adobe\CEP\extensions\com.errnull.SVGAConverter_FL"


del /s/q "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.errnull.SVGAConverter_FL"

mkdir "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.errnull.SVGAConverter_FL"

xcopy/s/q .\sources\*  "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.errnull.SVGAConverter_FL"