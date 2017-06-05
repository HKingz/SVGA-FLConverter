
var getActiveInfo = function () {

    var doc = fl.getDocumentDOM();
    if ( !doc ) {
        return null;
    }

    var path = doc.path;

    return path.split('.fla')[0];
}

var startConvert = function (paths) {

    var pathsArr = paths.split('_and_');

    var aprSourceURI = pathsArr.pop();

    var inFolder = pathsArr[0];

    var files = FLfile.listFolder(inFolder + "/*.fla", "files");

    var fileURI;

    for (fileURI in files) {
        fl.trace(fileURI = inFolder + '/' + files[fileURI]);

        var doc = fl.openDocument(fileURI);

        if (fileURI.indexOf('_Canvas.fla') < 0) {

            if (FLfile.exists(fileURI.slice(0, -4) + '_Canvas.fla'))
                doc = fl.openDocument(fileURI.slice(0, -4) + '_Canvas.fla');
            else {

                fl.trace(fl.configURI + 'Commands/Convert to Other Document Formats.jsfl');

                fl.runScript(fl.configURI + 'Commands/Convert to Other Document Formats.jsfl');
                doc.close(false);
                doc = fl.getDocumentDOM();
            }
        }

        doc.importPublishProfile(aprSourceURI);

        doc.publish();
        doc.close(false);
    }

};


if ( typeof JSON == "undefined" ) {
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
(function(){function N(p,r){function q(a){if(q[a]!==w)return q[a];var c;if("bug-string-char-index"==a)c="a"!="a"[0];else if("json"==a)c=q("json-stringify")&&q("json-parse");else{var e;if("json-stringify"==a){c=r.stringify;var b="function"==typeof c&&s;if(b){(e=function(){return 1}).toJSON=e;try{b="0"===c(0)&&"0"===c(new t)&&'""'==c(new A)&&c(u)===w&&c(w)===w&&c()===w&&"1"===c(e)&&"[1]"==c([e])&&"[null]"==c([w])&&"null"==c(null)&&"[null,null,null]"==c([w,u,null])&&'{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'==
c({a:[e,!0,!1,null,"\x00\b\n\f\r\t"]})&&"1"===c(null,e)&&"[\n 1,\n 2\n]"==c([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==c(new C(-864E13))&&'"+275760-09-13T00:00:00.000Z"'==c(new C(864E13))&&'"-000001-01-01T00:00:00.000Z"'==c(new C(-621987552E5))&&'"1969-12-31T23:59:59.999Z"'==c(new C(-1))}catch(f){b=!1}}c=b}if("json-parse"==a){c=r.parse;if("function"==typeof c)try{if(0===c("0")&&!c(!1)){e=c('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');var n=5==e.a.length&&1===e.a[0];if(n){try{n=!c('"\t"')}catch(d){}if(n)try{n=
1!==c("01")}catch(g){}if(n)try{n=1!==c("1.")}catch(m){}}}}catch(X){n=!1}c=n}}return q[a]=!!c}p||(p=k.Object());r||(r=k.Object());var t=p.Number||k.Number,A=p.String||k.String,H=p.Object||k.Object,C=p.Date||k.Date,G=p.SyntaxError||k.SyntaxError,K=p.TypeError||k.TypeError,L=p.Math||k.Math,I=p.JSON||k.JSON;"object"==typeof I&&I&&(r.stringify=I.stringify,r.parse=I.parse);var H=H.prototype,u=H.toString,v,B,w,s=new C(-0xc782b5b800cec);try{s=-109252==s.getUTCFullYear()&&0===s.getUTCMonth()&&1===s.getUTCDate()&&
10==s.getUTCHours()&&37==s.getUTCMinutes()&&6==s.getUTCSeconds()&&708==s.getUTCMilliseconds()}catch(Q){}if(!q("json")){var D=q("bug-string-char-index");if(!s)var x=L.floor,M=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,c){return M[c]+365*(a-1970)+x((a-1969+(c=+(1<c)))/4)-x((a-1901+c)/100)+x((a-1601+c)/400)};(v=H.hasOwnProperty)||(v=function(a){var c={},e;(c.__proto__=null,c.__proto__={toString:1},c).toString!=u?v=function(a){var c=this.__proto__;a=a in(this.__proto__=null,this);this.__proto__=
c;return a}:(e=c.constructor,v=function(a){var c=(this.constructor||e).prototype;return a in this&&!(a in c&&this[a]===c[a])});c=null;return v.call(this,a)});B=function(a,c){var e=0,b,f,n;(b=function(){this.valueOf=0}).prototype.valueOf=0;f=new b;for(n in f)v.call(f,n)&&e++;b=f=null;e?B=2==e?function(a,c){var e={},b="[object Function]"==u.call(a),f;for(f in a)b&&"prototype"==f||v.call(e,f)||!(e[f]=1)||!v.call(a,f)||c(f)}:function(a,c){var e="[object Function]"==u.call(a),b,f;for(b in a)e&&"prototype"==
b||!v.call(a,b)||(f="constructor"===b)||c(b);(f||v.call(a,b="constructor"))&&c(b)}:(f="valueOf toString toLocaleString propertyIsEnumerable isPrototypeOf hasOwnProperty constructor".split(" "),B=function(a,c){var e="[object Function]"==u.call(a),b,h=!e&&"function"!=typeof a.constructor&&F[typeof a.hasOwnProperty]&&a.hasOwnProperty||v;for(b in a)e&&"prototype"==b||!h.call(a,b)||c(b);for(e=f.length;b=f[--e];h.call(a,b)&&c(b));});return B(a,c)};if(!q("json-stringify")){var U={92:"\\\\",34:'\\"',8:"\\b",
12:"\\f",10:"\\n",13:"\\r",9:"\\t"},y=function(a,c){return("000000"+(c||0)).slice(-a)},R=function(a){for(var c='"',b=0,h=a.length,f=!D||10<h,n=f&&(D?a.split(""):a);b<h;b++){var d=a.charCodeAt(b);switch(d){case 8:case 9:case 10:case 12:case 13:case 34:case 92:c+=U[d];break;default:if(32>d){c+="\\u00"+y(2,d.toString(16));break}c+=f?n[b]:a.charAt(b)}}return c+'"'},O=function(a,c,b,h,f,n,d){var g,m,k,l,p,r,s,t,q;try{g=c[a]}catch(z){}if("object"==typeof g&&g)if(m=u.call(g),"[object Date]"!=m||v.call(g,
"toJSON"))"function"==typeof g.toJSON&&("[object Number]"!=m&&"[object String]"!=m&&"[object Array]"!=m||v.call(g,"toJSON"))&&(g=g.toJSON(a));else if(g>-1/0&&g<1/0){if(E){l=x(g/864E5);for(m=x(l/365.2425)+1970-1;E(m+1,0)<=l;m++);for(k=x((l-E(m,0))/30.42);E(m,k+1)<=l;k++);l=1+l-E(m,k);p=(g%864E5+864E5)%864E5;r=x(p/36E5)%24;s=x(p/6E4)%60;t=x(p/1E3)%60;p%=1E3}else m=g.getUTCFullYear(),k=g.getUTCMonth(),l=g.getUTCDate(),r=g.getUTCHours(),s=g.getUTCMinutes(),t=g.getUTCSeconds(),p=g.getUTCMilliseconds();
g=(0>=m||1E4<=m?(0>m?"-":"+")+y(6,0>m?-m:m):y(4,m))+"-"+y(2,k+1)+"-"+y(2,l)+"T"+y(2,r)+":"+y(2,s)+":"+y(2,t)+"."+y(3,p)+"Z"}else g=null;b&&(g=b.call(c,a,g));if(null===g)return"null";m=u.call(g);if("[object Boolean]"==m)return""+g;if("[object Number]"==m)return g>-1/0&&g<1/0?""+g:"null";if("[object String]"==m)return R(""+g);if("object"==typeof g){for(a=d.length;a--;)if(d[a]===g)throw K();d.push(g);q=[];c=n;n+=f;if("[object Array]"==m){k=0;for(a=g.length;k<a;k++)m=O(k,g,b,h,f,n,d),q.push(m===w?"null":
m);a=q.length?f?"[\n"+n+q.join(",\n"+n)+"\n"+c+"]":"["+q.join(",")+"]":"[]"}else B(h||g,function(a){var c=O(a,g,b,h,f,n,d);c!==w&&q.push(R(a)+":"+(f?" ":"")+c)}),a=q.length?f?"{\n"+n+q.join(",\n"+n)+"\n"+c+"}":"{"+q.join(",")+"}":"{}";d.pop();return a}};r.stringify=function(a,c,b){var h,f,n,d;if(F[typeof c]&&c)if("[object Function]"==(d=u.call(c)))f=c;else if("[object Array]"==d){n={};for(var g=0,k=c.length,l;g<k;l=c[g++],(d=u.call(l),"[object String]"==d||"[object Number]"==d)&&(n[l]=1));}if(b)if("[object Number]"==
(d=u.call(b))){if(0<(b-=b%1))for(h="",10<b&&(b=10);h.length<b;h+=" ");}else"[object String]"==d&&(h=10>=b.length?b:b.slice(0,10));return O("",(l={},l[""]=a,l),f,n,h,"",[])}}if(!q("json-parse")){var V=A.fromCharCode,W={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},b,J,l=function(){b=J=null;throw G();},z=function(){for(var a=J,c=a.length,e,h,f,k,d;b<c;)switch(d=a.charCodeAt(b),d){case 9:case 10:case 13:case 32:b++;break;case 123:case 125:case 91:case 93:case 58:case 44:return e=
D?a.charAt(b):a[b],b++,e;case 34:e="@";for(b++;b<c;)if(d=a.charCodeAt(b),32>d)l();else if(92==d)switch(d=a.charCodeAt(++b),d){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:e+=W[d];b++;break;case 117:h=++b;for(f=b+4;b<f;b++)d=a.charCodeAt(b),48<=d&&57>=d||97<=d&&102>=d||65<=d&&70>=d||l();e+=V("0x"+a.slice(h,b));break;default:l()}else{if(34==d)break;d=a.charCodeAt(b);for(h=b;32<=d&&92!=d&&34!=d;)d=a.charCodeAt(++b);e+=a.slice(h,b)}if(34==a.charCodeAt(b))return b++,e;l();default:h=
b;45==d&&(k=!0,d=a.charCodeAt(++b));if(48<=d&&57>=d){for(48==d&&(d=a.charCodeAt(b+1),48<=d&&57>=d)&&l();b<c&&(d=a.charCodeAt(b),48<=d&&57>=d);b++);if(46==a.charCodeAt(b)){for(f=++b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&l();b=f}d=a.charCodeAt(b);if(101==d||69==d){d=a.charCodeAt(++b);43!=d&&45!=d||b++;for(f=b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&l();b=f}return+a.slice(h,b)}k&&l();if("true"==a.slice(b,b+4))return b+=4,!0;if("false"==a.slice(b,b+5))return b+=5,!1;if("null"==a.slice(b,
b+4))return b+=4,null;l()}return"$"},P=function(a){var c,b;"$"==a&&l();if("string"==typeof a){if("@"==(D?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(c=[];;b||(b=!0)){a=z();if("]"==a)break;b&&(","==a?(a=z(),"]"==a&&l()):l());","==a&&l();c.push(P(a))}return c}if("{"==a){for(c={};;b||(b=!0)){a=z();if("}"==a)break;b&&(","==a?(a=z(),"}"==a&&l()):l());","!=a&&"string"==typeof a&&"@"==(D?a.charAt(0):a[0])&&":"==z()||l();c[a.slice(1)]=P(z())}return c}l()}return a},T=function(a,b,e){e=S(a,b,e);e===
w?delete a[b]:a[b]=e},S=function(a,b,e){var h=a[b],f;if("object"==typeof h&&h)if("[object Array]"==u.call(h))for(f=h.length;f--;)T(h,f,e);else B(h,function(a){T(h,a,e)});return e.call(a,b,h)};r.parse=function(a,c){var e,h;b=0;J=""+a;e=P(z());"$"!=z()&&l();b=J=null;return c&&"[object Function]"==u.call(c)?S((h={},h[""]=e,h),"",c):e}}}r.runInContext=N;return r}var K=typeof define==="function"&&define.amd,F={"function":!0,object:!0},G=F[typeof exports]&&exports&&!exports.nodeType&&exports,k=F[typeof window]&&
window||this,t=G&&F[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;!t||t.global!==t&&t.window!==t&&t.self!==t||(k=t);if(G&&!K)N(k,G);else{var L=k.JSON,Q=k.JSON3,M=!1,A=N(k,k.JSON3={noConflict:function(){M||(M=!0,k.JSON=L,k.JSON3=Q,L=Q=null);return A}});k.JSON={parse:A.parse,stringify:A.stringify}}K&&define(function(){return A})}).call(this); }


/// MD5.js
/// https://github.com/guless/converter
!function(r,n){"use strict";function e(r){for(var n=0,e=0,t=0;t<r.length;++t)e=r.charCodeAt(t),n+=e>=55296&&e<=56319?++t>=r.length?0:4:e<=127?1:e<=2047?2:3;for(var o=new Array(n),t=0,u=0;t<r.length;++t){if(e=r.charCodeAt(t),e>=56320&&e<=57343)throw new Error("Encounter an unpaired surrogate. [char="+e+"]");if(e>=55296&&e<=56319){if(++t>=r.length)throw new Error("Encounter an unpaired surrogate. [char="+e+"]");var a=r.charCodeAt(t);if(a<56320||a>57343)throw new Error("Encounter an unpaired surrogate. [char="+e+", tail="+a+"]");e=((1023&e)<<10|1023&a)+65536}e<=127?o[u++]=e:e<=2047?(o[u++]=(e>>>6)+192,o[u++]=(63&e)+128):e<=65535?(o[u++]=(e>>>12)+224,o[u++]=(e>>>6&63)+128,o[u++]=(63&e)+128):(o[u++]=(e>>>18)+240,o[u++]=(e>>>12&63)+128,o[u++]=(e>>>6&63)+128,o[u++]=(63&e)+128)}return o}function t(r){var n=[1732584193,4023233417,2562383102,271733878],t=[0,0],u=e(r),a=u.length%64;o(t,u.length),c(u,n);for(var f=0;f<h.length;++f)h[f]=f<a?u[u.length-a+f]:f==a?128:0;a<56?(h[56]=255&t[0],h[57]=t[0]>>>8&255,h[58]=t[0]>>>16&255,h[59]=t[0]>>>24&255,h[60]=255&t[1],h[61]=t[1]>>>8&255,h[62]=t[1]>>>16&255,h[63]=t[1]>>>24&255,c(h,n)):(g[56]=255&t[0],g[57]=t[0]>>>8&255,g[58]=t[0]>>>16&255,g[59]=t[0]>>>24&255,g[60]=255&t[1],g[61]=t[1]>>>8&255,g[62]=t[1]>>>16&255,g[63]=t[1]>>>24&255,c(h,n),c(g,n));for(var i=0;i<n.length;++i)n[i]=16711935&(n[i]<<8|n[i]>>>24)|4278255360&(n[i]<<24|n[i]>>>8);for(var i=0,d="";i<n.length;++i)d+=("00000000"+(n[i]>>>0).toString(16)).slice(-8);return d}function o(r,n){var e=n<<3>>>0;r[0]+=e,r[1]+=(n>>>29)+(r[0]<e)}function u(r,n,e,t,o,u,a){return r+=(n&e|~n&t)+o+a,r=r<<u|r>>>32-u,r+n}function a(r,n,e,t,o,u,a){return r+=(n&t|e&~t)+o+a,r=r<<u|r>>>32-u,r+n}function f(r,n,e,t,o,u,a){return r+=(n^e^t)+o+a,r=r<<u|r>>>32-u,r+n}function i(r,n,e,t,o,u,a){return r+=(e^(n|~t))+o+a,r=r<<u|r>>>32-u,r+n}function c(r,n){for(var e=0;e+64<=r.length;e+=64){for(var t=n[0],o=n[1],c=n[2],h=n[3],g=0,l=e;g<16;++g,l+=4)d[g]=r[l]|r[l+1]<<8|r[l+2]<<16|r[l+3]<<24;t=u(t,o,c,h,d[0],7,3614090360),h=u(h,t,o,c,d[1],12,3905402710),c=u(c,h,t,o,d[2],17,606105819),o=u(o,c,h,t,d[3],22,3250441966),t=u(t,o,c,h,d[4],7,4118548399),h=u(h,t,o,c,d[5],12,1200080426),c=u(c,h,t,o,d[6],17,2821735955),o=u(o,c,h,t,d[7],22,4249261313),t=u(t,o,c,h,d[8],7,1770035416),h=u(h,t,o,c,d[9],12,2336552879),c=u(c,h,t,o,d[10],17,4294925233),o=u(o,c,h,t,d[11],22,2304563134),t=u(t,o,c,h,d[12],7,1804603682),h=u(h,t,o,c,d[13],12,4254626195),c=u(c,h,t,o,d[14],17,2792965006),o=u(o,c,h,t,d[15],22,1236535329),t=a(t,o,c,h,d[1],5,4129170786),h=a(h,t,o,c,d[6],9,3225465664),c=a(c,h,t,o,d[11],14,643717713),o=a(o,c,h,t,d[0],20,3921069994),t=a(t,o,c,h,d[5],5,3593408605),h=a(h,t,o,c,d[10],9,38016083),c=a(c,h,t,o,d[15],14,3634488961),o=a(o,c,h,t,d[4],20,3889429448),t=a(t,o,c,h,d[9],5,568446438),h=a(h,t,o,c,d[14],9,3275163606),c=a(c,h,t,o,d[3],14,4107603335),o=a(o,c,h,t,d[8],20,1163531501),t=a(t,o,c,h,d[13],5,2850285829),h=a(h,t,o,c,d[2],9,4243563512),c=a(c,h,t,o,d[7],14,1735328473),o=a(o,c,h,t,d[12],20,2368359562),t=f(t,o,c,h,d[5],4,4294588738),h=f(h,t,o,c,d[8],11,2272392833),c=f(c,h,t,o,d[11],16,1839030562),o=f(o,c,h,t,d[14],23,4259657740),t=f(t,o,c,h,d[1],4,2763975236),h=f(h,t,o,c,d[4],11,1272893353),c=f(c,h,t,o,d[7],16,4139469664),o=f(o,c,h,t,d[10],23,3200236656),t=f(t,o,c,h,d[13],4,681279174),h=f(h,t,o,c,d[0],11,3936430074),c=f(c,h,t,o,d[3],16,3572445317),o=f(o,c,h,t,d[6],23,76029189),t=f(t,o,c,h,d[9],4,3654602809),h=f(h,t,o,c,d[12],11,3873151461),c=f(c,h,t,o,d[15],16,530742520),o=f(o,c,h,t,d[2],23,3299628645),t=i(t,o,c,h,d[0],6,4096336452),h=i(h,t,o,c,d[7],10,1126891415),c=i(c,h,t,o,d[14],15,2878612391),o=i(o,c,h,t,d[5],21,4237533241),t=i(t,o,c,h,d[12],6,1700485571),h=i(h,t,o,c,d[3],10,2399980690),c=i(c,h,t,o,d[10],15,4293915773),o=i(o,c,h,t,d[1],21,2240044497),t=i(t,o,c,h,d[8],6,1873313359),h=i(h,t,o,c,d[15],10,4264355552),c=i(c,h,t,o,d[6],15,2734768916),o=i(o,c,h,t,d[13],21,1309151649),t=i(t,o,c,h,d[4],6,4149444226),h=i(h,t,o,c,d[11],10,3174756917),c=i(c,h,t,o,d[2],15,718787259),o=i(o,c,h,t,d[9],21,3951481745),n[0]=n[0]+t&4294967295,n[1]=n[1]+o&4294967295,n[2]=n[2]+c&4294967295,n[3]=n[3]+h&4294967295}}var d=new Array(16),h=new Array(64),g=new Array(64);"function"==typeof define&&define.amd?define(function(){return t}):"undefined"!=typeof exports&&"undefined"!=typeof module?module.exports=t:r.md5=t}("undefined"==typeof window?this:window);