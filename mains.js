/*!
 * @project : svga-flconverter
 * @version : 1.0.0
 * @author  : UED.Errnull
 * @update  : 2017-05-25 12:20:18 pm
 */
!function(t){function r(n){if(e[n])return e[n].exports;var o=e[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var e={};return r.m=t,r.c=e,r.p="./js/",r(0)}([function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(1),i=n(o),s=e(48),a=n(s),p=handleComplete,u=0,h=null,c=function(t){stage.handleEvent(t),h.readFrame(u),u++;var r=exportRoot.totalFrames;if(1===r)for(var e=0;e<exportRoot.children.length;e++){var n=exportRoot.children[e];n.totalFrames>1&&(r=Math.max(r,n.totalFrames))}if(u>=r){createjs.Ticker.removeAllEventListeners(),h.resetOrders();var o=new a["default"](h);o.createZIPPackage(function(t){if(void 0!==window.cep){var r=new window.FileReader;r.readAsDataURL(t),r.onloadend=function(){base64data=r.result,window.top.saveAs(base64data.replace("data:application/zip;base64,",""))}}l(t)})}document.querySelector(".downloadButton").innerHTML="转换中："+parseInt(u/r*100)+"%"},l=function(t){var r=new window.FileReader;r.readAsDataURL(t),r.onloadend=function(){base64data=r.result,document.querySelector("#canvas").style.opacity=1,document.querySelector(".downloadButton").innerHTML="下载 SVGA 文件";var t=new Svga.Player("#canvas"),e=new Svga.Parser;e.load(base64data.replace("data:application/zip;base64,","data:image/svga;base64,"),function(r){t.setVideoItem(r),t.startAnimation()})}};handleComplete=function(t){if(p(t),60%lib.properties.fps>0)throw alert("FPS 只能是 60 的约数，如 [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]，当前 FPS = "+lib.properties.fps+"，请修改后再执行导出操作。"),document.querySelector("#canvas").style.opacity=0,document.querySelector(".downloadButton").innerHTML="转换失败",new Error("FPS 只能是 60 的约数，如 [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]，当前 FPS = "+lib.properties.fps+"，请修改后再执行导出操作。");if(!window.location.href.startsWith("http://"))throw alert("请在 Flash 软件中，按 ctrl + enter 或 command + return 进行导出操作。"),document.querySelector("#canvas").style.opacity=0,document.querySelector(".downloadButton").innerHTML="转换失败",new Error("请在 Flash 软件中，按 ctrl + enter 或 command + return 进行导出操作。");createjs.Ticker.removeAllEventListeners(),h=new i["default"],createjs.Ticker.addEventListener("tick",c),document.querySelector("#canvas").style.opacity=0,document.querySelector(".downloadButton").innerHTML="正在转换中"},navigator.userAgent.indexOf("Chrome")<0&&alert("请复制 URL， 然后使用 Chrome 浏览器打开此页面")},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(2),i=n(o),s=e(37),a=n(s),p=e(38),u=n(p),h=e(42),c=n(h),l=e(43),f=n(l),d=e(44),v=(n(d),e(45)),y=n(v),m=e(46),g=n(m),x=e(47),_=n(x);t.exports=function(){function t(){var r=this;(0,a["default"])(this,t),this._movie=null,this._frames=[],this._resources={},this.readFrame=function(t){r._movie.frameCount=t+1,r._orderCurrent=0;var e=r.findLayerFrames(stage);r._frames.push(e)},this.resetOrders=function(){for(var t=[],e=r._frames.map(function(t){return t.map(function(t){return t.imageKey})}),n=0;n<e.length;n++)t=r.combineString(t,e[n]);for(var o=0;o<r._frames.length;o++)for(var i=r._frames[o],s=t.map(function(t){return{aKey:t,used:!1}}),a=0;a<i.length;a++)for(var p=i[a],u=0;u<s.length;u++){var h=s[u];if(h.used===!1&&h.aKey===p.imageKey){h.used=!0,p.layerOrder=u;for(var c=0;c<u;c++)s[c].used=!0;break}}},this.findLayerFrames=function(t){var e=[];if(t.children instanceof Array)for(var n=0;n<t.children.length;n++)for(var o=r.findLayerFrames(t.children[n]),i=0;i<o.length;i++)e.push(o[i]);else e.push(r.parseLayerFrame(t));return e},this.parseLayerFrame=function(t){var e=new f["default"];if(t.image instanceof Node){var n=t.image.src.toString().split("/").pop().replace(".png","").split("?")[0];null!==n.match(/[^a-zA-Z0-9\.\-\_]/)&&(n=md5(n));var o={imageKey:n,dataPath:t.image.src.toString()};e.imageKey=o.imageKey,void 0===r._resources[o.imageKey]&&(r._resources[o.imageKey]=o),e.layout.x=t.getBounds().x,e.layout.y=t.getBounds().y,e.layout.width=t.getBounds().width,e.layout.height=t.getBounds().height}else if(void 0!==t.graphics&&null!==t.graphics){e.imageKey=t.id+".vector";var i={type:"shape",args:{d:new y["default"](t.graphics).requestPath()},styles:new g["default"](t.graphics).requestStyle()};e.shapes.push(i)}e.alpha=t.alpha;for(var s=t.parent;null!=s&&void 0!=s;)e.alpha=e.alpha*s.alpha,s=s.parent;var a=new createjs.Matrix2D;a=a.appendMatrix(new createjs.Matrix2D(t._props.matrix.a,t._props.matrix.b,t._props.matrix.c,t._props.matrix.d,t._props.matrix.tx,t._props.matrix.ty));for(var p=t.parent;null!=p&&void 0!=p;)a=new createjs.Matrix2D(p._props.matrix.a,p._props.matrix.b,p._props.matrix.c,p._props.matrix.d,p._props.matrix.tx,p._props.matrix.ty).appendMatrix(a),p=p.parent;return e.transform.a=a.a,e.transform.b=a.b,e.transform.c=a.c,e.transform.d=a.d,e.transform.tx=a.tx,e.transform.ty=a.ty,e.clipPath=new _["default"](t).requestMaskPath(),e},this.combined=function(){for(var t={},e=0;e<r._frames.length;e++){for(var n=r._frames[e],o=0;o<n.length;o++){var s=n[o];if(void 0===t[s.layerOrder]){t[s.layerOrder]=[];for(var a=0;a<e;a++)t[s.layerOrder].push({})}t[s.layerOrder].push(s),s.imageKey&&(t[s.layerOrder].imageKey=s.imageKey)}for(var p in t)if(t.hasOwnProperty(p)){var u=t[p];void 0===u[e]&&t[p].push({})}}for(trim=function(t){var e=!1,n=null,o=null;for(var s in t)if(t.hasOwnProperty(s)){var a=t[s];if(e)break;if(null===n)n=a;else{if(n.imageKey===a.imageKey||n.imageKey&&n.imageKey.indexOf(".vector")>0&&a.imageKey&&a.imageKey.indexOf(".vector")>0){o=a;for(var p=0;p<r._movie.frameCount;p++)if((0,i["default"])(n[p]).length>0&&(0,i["default"])(o[p]).length>0){n=o,o=null;break}if(null==n||null==o)continue;for(var u=0;u<r._movie.frameCount;u++)(0,i["default"])(o[u]).length>0&&(n[u]=o[u]);delete t[s],e=!0;break}n=a,o=null}}return e};trim(t););return t},this._movie=new c["default"]}return(0,u["default"])(t,[{key:"combineString",value:function(t,r){function e(){for(var e=0;e<r.length;e++){for(var n={location:e,length:0,aLocation:-1,aLength:0},o={},s=e;s<r.length;s++){for(var a=r[s],p=!1,u=0;u<t.length;u++){var h=t[u];if(h===a&&o[u]!==!0){for(var c=0;c<=u;c++)o[c]=!0;p=!0,n.length=s-e+1,n.aLocation<0&&(n.aLocation=u),n.aLength=u-n.aLocation+1;break}}if(!p)break}n.length>0&&i.push(n)}}function n(){for(var t=!1,r=0;r<i.length;r++){for(var e=i[r],n=0;n<i.length;n++){var o=i[n];if(r!==n){if(e.location<=o.location&&e.location+e.length>=o.location+o.length){i.splice(n,1),t=!0;break}if(o.location<=e.location&&o.location+o.length>=e.location+e.length){i.splice(r,1),t=!0;break}}}if(t)break}return t}function o(){var e=[];if(0==i.length){for(var n=0;n<t.length;n++)e.push(t[n]);for(var n=0;n<r.length;n++)e.push(r[n]);return e}i.sort(function(t,r){return t.location>r.location?1:-1});for(var o=0,s=0,a=0;a<i.length;a++){for(var p=i[a],u=t.slice(o,p.aLocation),h=r.slice(s,p.location),c=t.slice(p.aLocation,p.aLocation+p.aLength),n=0;n<u.length;n++)e.push(u[n]);for(var n=0;n<h.length;n++)e.push(h[n]);for(var n=0;n<c.length;n++)e.push(c[n]);if(a==i.length-1){for(var l=t.slice(p.aLocation+p.aLength,t.length),f=r.slice(p.location+p.length,r.length),n=0;n<l.length;n++)e.push(l[n]);for(var n=0;n<f.length;n++)e.push(f[n])}else o=p.aLocation+p.aLength,s=p.location+p.length}return e}if(0==t.length)return r;if(0==r.length)return t;var i=[];for(e();n(););return o()}}]),t}()},function(t,r,e){t.exports={"default":e(3),__esModule:!0}},function(t,r,e){e(4),t.exports=e(24).Object.keys},function(t,r,e){var n=e(5),o=e(7);e(22)("keys",function(){return function(t){return o(n(t))}})},function(t,r,e){var n=e(6);t.exports=function(t){return Object(n(t))}},function(t,r){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,r,e){var n=e(8),o=e(21);t.exports=Object.keys||function(t){return n(t,o)}},function(t,r,e){var n=e(9),o=e(10),i=e(13)(!1),s=e(17)("IE_PROTO");t.exports=function(t,r){var e,a=o(t),p=0,u=[];for(e in a)e!=s&&n(a,e)&&u.push(e);for(;r.length>p;)n(a,e=r[p++])&&(~i(u,e)||u.push(e));return u}},function(t,r){var e={}.hasOwnProperty;t.exports=function(t,r){return e.call(t,r)}},function(t,r,e){var n=e(11),o=e(6);t.exports=function(t){return n(o(t))}},function(t,r,e){var n=e(12);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==n(t)?t.split(""):Object(t)}},function(t,r){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,r,e){var n=e(10),o=e(14),i=e(16);t.exports=function(t){return function(r,e,s){var a,p=n(r),u=o(p.length),h=i(s,u);if(t&&e!=e){for(;u>h;)if(a=p[h++],a!=a)return!0}else for(;u>h;h++)if((t||h in p)&&p[h]===e)return t||h||0;return!t&&-1}}},function(t,r,e){var n=e(15),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},function(t,r){var e=Math.ceil,n=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?n:e)(t)}},function(t,r,e){var n=e(15),o=Math.max,i=Math.min;t.exports=function(t,r){return t=n(t),t<0?o(t+r,0):i(t,r)}},function(t,r,e){var n=e(18)("keys"),o=e(20);t.exports=function(t){return n[t]||(n[t]=o(t))}},function(t,r,e){var n=e(19),o="__core-js_shared__",i=n[o]||(n[o]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,r){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,r){var e=0,n=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+n).toString(36))}},function(t,r){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,r,e){var n=e(23),o=e(24),i=e(33);t.exports=function(t,r){var e=(o.Object||{})[t]||Object[t],s={};s[t]=r(e),n(n.S+n.F*i(function(){e(1)}),"Object",s)}},function(t,r,e){var n=e(19),o=e(24),i=e(25),s=e(27),a="prototype",p=function(t,r,e){var u,h,c,l=t&p.F,f=t&p.G,d=t&p.S,v=t&p.P,y=t&p.B,m=t&p.W,g=f?o:o[r]||(o[r]={}),x=g[a],_=f?n:d?n[r]:(n[r]||{})[a];f&&(e=r);for(u in e)h=!l&&_&&void 0!==_[u],h&&u in g||(c=h?_[u]:e[u],g[u]=f&&"function"!=typeof _[u]?e[u]:y&&h?i(c,n):m&&_[u]==c?function(t){var r=function(r,e,n){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(r);case 2:return new t(r,e)}return new t(r,e,n)}return t.apply(this,arguments)};return r[a]=t[a],r}(c):v&&"function"==typeof c?i(Function.call,c):c,v&&((g.virtual||(g.virtual={}))[u]=c,t&p.R&&x&&!x[u]&&s(x,u,c)))};p.F=1,p.G=2,p.S=4,p.P=8,p.B=16,p.W=32,p.U=64,p.R=128,t.exports=p},function(t,r){var e=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=e)},function(t,r,e){var n=e(26);t.exports=function(t,r,e){if(n(t),void 0===r)return t;switch(e){case 1:return function(e){return t.call(r,e)};case 2:return function(e,n){return t.call(r,e,n)};case 3:return function(e,n,o){return t.call(r,e,n,o)}}return function(){return t.apply(r,arguments)}}},function(t,r){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,r,e){var n=e(28),o=e(36);t.exports=e(32)?function(t,r,e){return n.f(t,r,o(1,e))}:function(t,r,e){return t[r]=e,t}},function(t,r,e){var n=e(29),o=e(31),i=e(35),s=Object.defineProperty;r.f=e(32)?Object.defineProperty:function(t,r,e){if(n(t),r=i(r,!0),n(e),o)try{return s(t,r,e)}catch(a){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[r]=e.value),t}},function(t,r,e){var n=e(30);t.exports=function(t){if(!n(t))throw TypeError(t+" is not an object!");return t}},function(t,r){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,r,e){t.exports=!e(32)&&!e(33)(function(){return 7!=Object.defineProperty(e(34)("div"),"a",{get:function(){return 7}}).a})},function(t,r,e){t.exports=!e(33)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,r){t.exports=function(t){try{return!!t()}catch(r){return!0}}},function(t,r,e){var n=e(30),o=e(19).document,i=n(o)&&n(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,r,e){var n=e(30);t.exports=function(t,r){if(!n(t))return t;var e,o;if(r&&"function"==typeof(e=t.toString)&&!n(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!n(o=e.call(t)))return o;if(!r&&"function"==typeof(e=t.toString)&&!n(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,r){t.exports=function(t,r){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:r}}},function(t,r){"use strict";r.__esModule=!0,r["default"]=function(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}},function(t,r,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}r.__esModule=!0;var o=e(39),i=n(o);r["default"]=function(){function t(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(t,n.key,n)}}return function(r,e,n){return e&&t(r.prototype,e),n&&t(r,n),r}}()},function(t,r,e){t.exports={"default":e(40),__esModule:!0}},function(t,r,e){e(41);var n=e(24).Object;t.exports=function(t,r,e){return n.defineProperty(t,r,e)}},function(t,r,e){var n=e(23);n(n.S+n.F*!e(32),"Object",{defineProperty:e(28).f})},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(37),i=n(o);t.exports=function s(){(0,i["default"])(this,s),this.viewBox={width:0,height:0},this.fps=20,this.frameCount=0,this.viewBox.width=lib.properties.width,this.viewBox.height=lib.properties.height,this.fps=lib.properties.fps,this.frameCount=exportRoot.totalFrames}},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(37),i=n(o);t.exports=function s(){(0,i["default"])(this,s),this.layerOrder=null,this.imageKey=void 0,this.alpha=0,this.transform={a:1,b:0,c:0,d:1,tx:0,ty:0},this.layout={x:0,y:0,width:0,height:0},this.clipPath=void 0,this.shapes=[]}},function(t,r){t.exports=function(){function t(){return this.props[0]=1,this.props[1]=0,this.props[2]=0,this.props[3]=0,this.props[4]=0,this.props[5]=1,this.props[6]=0,this.props[7]=0,this.props[8]=0,this.props[9]=0,this.props[10]=1,this.props[11]=0,this.props[12]=0,this.props[13]=0,this.props[14]=0,this.props[15]=1,this}function r(t){if(0===t)return this;var r=Math.cos(t),e=Math.sin(t);return this._t(r,-e,0,0,e,r,0,0,0,0,1,0,0,0,0,1)}function e(t){if(0===t)return this;var r=Math.cos(t),e=Math.sin(t);return this._t(1,0,0,0,0,r,-e,0,0,e,r,0,0,0,0,1)}function n(t){if(0===t)return this;var r=Math.cos(t),e=Math.sin(t);return this._t(r,0,e,0,0,1,0,0,-e,0,r,0,0,0,0,1)}function o(t){if(0===t)return this;var r=Math.cos(t),e=Math.sin(t);return this._t(r,-e,0,0,e,r,0,0,0,0,1,0,0,0,0,1)}function i(t,r){return this._t(1,r,t,1,0,0)}function s(t,r){return this.shear(Math.tan(t),Math.tan(r))}function a(t,r){var e=Math.cos(r),n=Math.sin(r);return this._t(e,n,0,0,-n,e,0,0,0,0,1,0,0,0,0,1)._t(1,0,0,0,Math.tan(t),1,0,0,0,0,1,0,0,0,0,1)._t(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1)}function p(t,r,e){return e=isNaN(e)?1:e,1==t&&1==r&&1==e?this:this._t(t,0,0,0,0,r,0,0,0,0,e,0,0,0,0,1)}function u(t,r,e,n,o,i,s,a,p,u,h,c,l,f,d,v){return this.props[0]=t,this.props[1]=r,this.props[2]=e,this.props[3]=n,this.props[4]=o,this.props[5]=i,this.props[6]=s,this.props[7]=a,this.props[8]=p,this.props[9]=u,this.props[10]=h,this.props[11]=c,this.props[12]=l,this.props[13]=f,this.props[14]=d,this.props[15]=v,this}function h(t,r,e){return e=isNaN(e)?0:e,0!==t||0!==r||0!==e?this._t(1,0,0,0,0,1,0,0,0,0,1,0,t,r,e,1):this}function c(t,r,e,n,o,i,s,a,p,u,h,c,l,f,d,v){if(1===t&&0===r&&0===e&&0===n&&0===o&&1===i&&0===s&&0===a&&0===p&&0===u&&1===h&&0===c)return 0===l&&0===f&&0===d||(this.props[12]=this.props[12]*t+this.props[13]*o+this.props[14]*p+this.props[15]*l,this.props[13]=this.props[12]*r+this.props[13]*i+this.props[14]*u+this.props[15]*f,this.props[14]=this.props[12]*e+this.props[13]*s+this.props[14]*h+this.props[15]*d,this.props[15]=this.props[12]*n+this.props[13]*a+this.props[14]*c+this.props[15]*v),this;var y=this.props[0],m=this.props[1],g=this.props[2],x=this.props[3],_=this.props[4],w=this.props[5],b=this.props[6],P=this.props[7],S=this.props[8],k=this.props[9],M=this.props[10],T=this.props[11],L=this.props[12],O=this.props[13],q=this.props[14],j=this.props[15];return this.props[0]=y*t+m*o+g*p+x*l,this.props[1]=y*r+m*i+g*u+x*f,this.props[2]=y*e+m*s+g*h+x*d,this.props[3]=y*n+m*a+g*c+x*v,this.props[4]=_*t+w*o+b*p+P*l,this.props[5]=_*r+w*i+b*u+P*f,this.props[6]=_*e+w*s+b*h+P*d,this.props[7]=_*n+w*a+b*c+P*v,this.props[8]=S*t+k*o+M*p+T*l,this.props[9]=S*r+k*i+M*u+T*f,this.props[10]=S*e+k*s+M*h+T*d,this.props[11]=S*n+k*a+M*c+T*v,this.props[12]=L*t+O*o+q*p+j*l,this.props[13]=L*r+O*i+q*u+j*f,this.props[14]=L*e+O*s+q*h+j*d,this.props[15]=L*n+O*a+q*c+j*v,this}function l(t){var r;for(r=0;r<16;r+=1)t.props[r]=this.props[r]}function f(t){var r;for(r=0;r<16;r+=1)this.props[r]=t[r]}function d(t,r,e){return{x:t*this.props[0]+r*this.props[4]+e*this.props[8]+this.props[12],y:t*this.props[1]+r*this.props[5]+e*this.props[9]+this.props[13],z:t*this.props[2]+r*this.props[6]+e*this.props[10]+this.props[14]}}function v(t,r,e){return t*this.props[0]+r*this.props[4]+e*this.props[8]+this.props[12]}function y(t,r,e){return t*this.props[1]+r*this.props[5]+e*this.props[9]+this.props[13]}function m(t,r,e){return t*this.props[2]+r*this.props[6]+e*this.props[10]+this.props[14]}function g(t,r,e){return[t*this.props[0]+r*this.props[4]+e*this.props[8]+this.props[12],t*this.props[1]+r*this.props[5]+e*this.props[9]+this.props[13],t*this.props[2]+r*this.props[6]+e*this.props[10]+this.props[14]]}function x(t,r){return bm_rnd(t*this.props[0]+r*this.props[4]+this.props[12])+","+bm_rnd(t*this.props[1]+r*this.props[5]+this.props[13])}function _(){return[this.props[0],this.props[1],this.props[2],this.props[3],this.props[4],this.props[5],this.props[6],this.props[7],this.props[8],this.props[9],this.props[10],this.props[11],this.props[12],this.props[13],this.props[14],this.props[15]]}function w(){return isSafari?"matrix3d("+roundTo2Decimals(this.props[0])+","+roundTo2Decimals(this.props[1])+","+roundTo2Decimals(this.props[2])+","+roundTo2Decimals(this.props[3])+","+roundTo2Decimals(this.props[4])+","+roundTo2Decimals(this.props[5])+","+roundTo2Decimals(this.props[6])+","+roundTo2Decimals(this.props[7])+","+roundTo2Decimals(this.props[8])+","+roundTo2Decimals(this.props[9])+","+roundTo2Decimals(this.props[10])+","+roundTo2Decimals(this.props[11])+","+roundTo2Decimals(this.props[12])+","+roundTo2Decimals(this.props[13])+","+roundTo2Decimals(this.props[14])+","+roundTo2Decimals(this.props[15])+")":(this.cssParts[1]=this.props.join(","),this.cssParts.join(""))}function b(){return"matrix("+this.props[0]+","+this.props[1]+","+this.props[4]+","+this.props[5]+","+this.props[12]+","+this.props[13]+")"}function P(){return""+this.toArray()}return function(){this.reset=t,this.rotate=r,this.rotateX=e,this.rotateY=n,this.rotateZ=o,this.skew=s,this.skewFromAxis=a,this.shear=i,this.scale=p,this.setTransform=u,this.translate=h,this.transform=c,this.applyToPoint=d,this.applyToX=v,this.applyToY=y,this.applyToZ=m,this.applyToPointArray=g,this.applyToPointStringified=x,this.toArray=_,this.toCSS=w,this.to2dCSS=b,this.toString=P,this.clone=l,this.cloneFromProps=f,this._t=this.transform,this.props=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],this.cssParts=["matrix3d(","",")"]}}()},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(37),i=n(o);t.exports=function s(t){var r=this;(0,i["default"])(this,s),this.graphics=null,this.requestPoint=function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?0:arguments[1],e=arguments.length<=2||void 0===arguments[2]?1:arguments[2],n=arguments.length<=3||void 0===arguments[3]?0:arguments[3];return((t+r-n)*e+n).toFixed(6)},this.requestPath=function(){for(var t=arguments.length<=0||void 0===arguments[0]?{x:0,y:0}:arguments[0],e=arguments.length<=1||void 0===arguments[1]?{x:1,y:1}:arguments[1],n=arguments.length<=2||void 0===arguments[2]?{x:0,y:0}:arguments[2],o=r.graphics.getInstructions(),i="",s=0;s<o.length;s++){var a=o[s];a instanceof createjs.Graphics.BeginPath||(a instanceof createjs.Graphics.MoveTo?i+="M "+r.requestPoint(a.x,t.x,e.x,n.x)+" "+r.requestPoint(a.y,t.y,e.y,n.y)+" ":a instanceof createjs.Graphics.LineTo?i+="L "+r.requestPoint(a.x,t.x,e.x,n.x)+" "+r.requestPoint(a.y,t.y,e.y,n.y)+" ":a instanceof createjs.Graphics.BezierCurveTo?i+="C "+r.requestPoint(a.cp1x,t.x,e.x,n.x)+" "+r.requestPoint(a.cp1y,t.y,e.y,n.y)+" "+r.requestPoint(a.cp2x,t.x,e.x,n.x)+" "+r.requestPoint(a.cp2y,t.y,e.y,n.y)+" "+r.requestPoint(a.x,t.x,e.x,n.x)+" "+r.requestPoint(a.y,t.y,e.y,n.y)+" ":a instanceof createjs.Graphics.QuadraticCurveTo?i+="Q "+r.requestPoint(a.cpx,t.x,e.x,n.x)+" "+r.requestPoint(a.cpy,t.y,e.y,n.y)+" "+r.requestPoint(a.x,t.x,e.x,n.x)+" "+r.requestPoint(a.y,t.y,e.y,n.y)+" ":a instanceof createjs.Graphics.ClosePath&&(i+="Z "))}return i},this.graphics=t}},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(37),i=n(o);t.exports=function s(t){var r=this;(0,i["default"])(this,s),this.graphics=null,this.requestStyle=function(){var t={};return r.graphics._fill&&(t.fill=r.requestColorArray(r.graphics._fill.style)),r.graphics._stroke&&(t.stroke=r.requestColorArray(r.graphics._stroke.style),r.graphics._strokeStyle&&(t.strokeWidth=r.graphics._strokeStyle.width,0===r.graphics._strokeStyle.caps?t.lineCap="butt":1===r.graphics._strokeStyle.caps?t.lineCap="round":2===r.graphics._strokeStyle.caps&&(t.lineCap="square"),0===r.graphics._strokeStyle.joints?t.lineJoin="miter":1===r.graphics._strokeStyle.joints?t.lineJoin="round":2===r.graphics._strokeStyle.joints&&(t.lineJoin="bevel"),t.miterLimit=r.graphics._strokeStyle.miterLimit)),t},this.requestColorArray=function(t){if("string"!=typeof t)return[0,0,0,1];var r=t.replace("#","");if(6==r.length){var e=r.substr(0,2),n=r.substr(2,2),o=r.substr(4,2);return[parseInt("0x"+e)/255,parseInt("0x"+n)/255,parseInt("0x"+o)/255,1]}return[0,0,0,1]},this.graphics=t}},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(37),i=n(o),s=e(38),a=n(s),p=e(45),u=n(p);t.exports=function(){function t(r){(0,i["default"])(this,t),this.layer=null,this.layer=r}return(0,a["default"])(t,[{key:"requestMaskPath",value:function(){var t=!1,r="";null!=this.layer.mask&&void 0!=this.layer.mask&&(r+=new u["default"](this.layer.mask.graphics).requestPath({x:0,y:0}),t=!0);for(var e=this.layer.x-this.layer.regX,n=this.layer.y-this.layer.regY,o=this.layer.scaleX,i=this.layer.scaleY,s=this.layer.regX,a=this.layer.regY,p=[],h=this.layer.parent;null!=h&&void 0!=h;)p.push(h),h=h.parent;for(var c=0;c<p.length;c++){var l=p[c];if(e+=l.x-l.regX,n+=l.y-l.regY,o*=l.scaleX,i*=l.scaleY,s+=l.regX,a+=l.regY,null!=l.mask&&void 0!=l.mask){r+=new u["default"](l.mask.graphics).requestPath({x:-(e-l.mask.x),y:-(n-l.mask.y)},{x:1/o,y:1/i},{x:s,y:a}),window.aaa=l.mask,t=!0;break}}return t?r:void 0}}]),t}()},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(49),i=n(o),s=e(37),a=n(s),p=e(38),u=n(p),h=e(51),c=n(h);t.exports=function(){function t(r){(0,a["default"])(this,t),this.timeline=null,this.resources={},this.timeline=r}return(0,u["default"])(t,[{key:"createZIPPackage",value:function(t){var r=this,e=new JSZip,n=new c["default"](this.timeline._resources);n.copyToZIP(e,function(n){r.resources=n,e.file("movie.spec",(0,i["default"])(r.createSpec())),e.generateAsync({type:"blob",compression:"DEFLATE"}).then(function(r){t(r),document.querySelector(".downloadButton").onclick=function(){void 0!==window.cep||(navigator.userAgent.indexOf("Chrome")<0?alert("请复制 URL， 然后使用 Chrome 浏览器打开此页面"):saveAs(r,document.title+"_"+(new Date).toLocaleDateString()+".svga"))}},function(t){console.log(t)})})}},{key:"createSpec",value:function(){var t=this.timeline.combined(),r=[];for(var e in t)t.hasOwnProperty(e)&&!function(){for(var n=t[e],o=function(){for(var t=0;t<n.length;t++){var r=n[t];if(void 0!==r.imageKey)return r.imageKey}},s={imageKey:o(),frames:n.map(function(t){return{alpha:t.alpha,layout:t.layout,transform:t.transform,clipPath:t.clipPath,shapes:t.shapes}})},a="",p=0;p<s.frames.length;p++){var u=s.frames[p];u.alpha<=0?s.frames[p]={}:(u.transform&&1==u.transform.a&&0==u.transform.b&&0==u.transform.c&&1==u.transform.d&&0==u.transform.tx&&0==u.transform.ty&&delete s.frames[p].transform,u.clipPath&&0==u.clipPath.length&&delete s.frames[p].clipPath,u.shapes&&u.shapes.length>0&&((0,i["default"])(u.shapes)===a?s.frames[p].shapes=[{type:"keep"}]:a=(0,i["default"])(u.shapes)))}r.push(s)}();var n={ver:"1.1.0",movie:{viewBox:{width:this.timeline._movie.viewBox.width,height:this.timeline._movie.viewBox.height},fps:this.timeline._movie.fps,frames:this.timeline._movie.frameCount},images:this.resources,sprites:r};return n}}]),t}()},function(t,r,e){t.exports={"default":e(50),__esModule:!0}},function(t,r,e){var n=e(24),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,r,e){function n(t){return t&&t.__esModule?t:{"default":t}}var o=e(2),i=n(o),s=e(37),a=n(s),p=e(38),u=n(p);t.exports=function(){function t(r){var e=this;(0,a["default"])(this,t),this.resource={},this.copyToZIP=function(t,r){if(0==(0,i["default"])(e.resource).length)return void r({});var n=e,o=0,s={},a=0,p=function(p){e.resource.hasOwnProperty(p)&&!function(){a++;var u=(e.resource[p].imageKey,p+".png"),h=new XMLHttpRequest;h.responseType="blob",h.open("GET",e.resource[p].dataPath,!0),h.onload=function(){var e=new window.FileReader;e.readAsDataURL(h.response),e.onloadend=function(){var a=e.result,h=n.dataURLtoUint8(a);if(void 0!==window.cep){var c=new Blob([h]);t.file(u,c)}else{var l=pngquant(h,{quality:"0-100",speed:"2"},console.log),f=new Blob([l.data.buffer]);t.file(u,f)}o++,s[p]=p,o>=(0,i["default"])(n.resource).length&&r(s)}},h.send()}()};for(var u in e.resource)p(u)},this.resource=r}return(0,u["default"])(t,[{key:"dataURLtoUint8",value:function(t){for(var r=t.split(","),e=(r[0].match(/:(.*?);/)[1],atob(r[1])),n=e.length,o=new Uint8Array(n);n--;)o[n]=e.charCodeAt(n);return o}}]),t}()}]);