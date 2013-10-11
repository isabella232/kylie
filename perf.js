(function(window){'use strict';/*
 Copyright (c) 2011, Yahoo! Inc.  All rights reserved.
 Copyright (c) 2012, Log-Normal, Inc.  All rights reserved.
 Copyright (c) 2013, SOASTA, Inc. All rights reserved.
 Copyright (c) 2013, Salesforce.com. All rights reserved.
 Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.
*/
var d=(new Date).getTime(),l;
(function(c){c.parent!==c&&document.getElementById("boomr-if-as")&&"script"===document.getElementById("boomr-if-as").nodeName.toLowerCase()&&(c=c.parent);var f=c.document,a,e=c.perfOptions||{};l=void 0===c.ea?{}:c.ea;if(!l.version){l.version="0.9";l.window=c;var b={G:"",ca:c.location.hostname.replace(/.*?([^.]+\.[^.]+)\.?$/,"$1").toLowerCase(),Ha:"",n:!1,Z:!1,w:{page_ready:[],page_unload:[],dom_loaded:[],onLoad:[],visibility_changed:[],before_beacon:[],click:[]},f:{},t:{},pa:function(a){var h;a||
(a=c.event);a.target?h=a.target:a.srcElement&&(h=a.srcElement);3===h.nodeType&&(h=h.parentNode);h&&"OBJECT"===h.nodeName.toUpperCase()&&"application/x-shockwave-flash"===h.type||b.fireEvent("click",h)},fireEvent:function(a,c){var e,g,f;if(!b.w.hasOwnProperty(a))return!1;f=b.w[a];for(e=0;e<f.length;e++)g=f[e],g[0].call(g[2],c,g[1]);return!0}},g={m:void 0,g:d,da:null,c:{B:function(b,a){var c=[],e;if(!b||"object"!==typeof b)return b;void 0===a&&(a="\n\t");for(e in b)Object.prototype.hasOwnProperty.call(b,
e)&&c.push(encodeURIComponent(e)+"="+encodeURIComponent(b[e]));return c.join(a)},J:function(b){if(!b)return null;b=" "+b+"=";var a,c;c=" "+f.cookie+";";return 0<=(a=c.indexOf(b))?(a+=b.length,c=c.substring(a,c.indexOf(";",a))):null},setCookie:function(a,c,e){var g,s,q;if(!a||!b.ca)return!1;c=l.c.B(c,"&");g=a+"="+c;s=[g,"path=/","domain="+b.ca];e&&(q=new Date,q.setTime(q.getTime()+1E3*e),q=q.toGMTString(),s.push("expires="+q));return 4E3>g.length?(f.cookie=s.join("; "),c===l.c.J(a)):!1},V:function(b){var a,
c,e,g={};if(!b)return null;b=b.split("&");if(0===b.length)return null;a=0;for(c=b.length;a<c;a++)e=b[a].split("="),e.push(""),g[decodeURIComponent(e[0])]=decodeURIComponent(e[1]);return g},sa:function(b){return l.c.setCookie(b,{},0)},ra:function(b,a,c,e){var g,f=0;if(!a||!a[c])return!1;for(g=0;g<e.length;g++)void 0!==a[c][e[g]]&&(b[e[g]]=a[c][e[g]],f++);return 0<f},addListener:function(b,a,c){b.addEventListener?b.addEventListener(a,c,!1):b.attachEvent("on"+a,c)}},j:function(a){var e,k,n=["beacon_url",
"site_domain","user_ip"];a||(a={});for(e=0;e<n.length;e++)void 0!==a[n[e]]&&(b[n[e]]=a[n[e]]);void 0!==a.log&&(l.log=a.log);l.log||(l.log=function(){});for(k in l.plugins)l.plugins.hasOwnProperty(k)&&(a[k]&&a[k].hasOwnProperty("enabled")&&!1===a[k].enabled?b.t[k]=1:(b.t[k]&&delete b.t[k],"function"===typeof l.plugins[k].j&&l.plugins[k].j(a)));if(b.Z)return l;b.n||void 0!==a.S&&!1===a.S||(f.readyState&&"complete"===f.readyState?l.setImmediate(l.C,null,null,l):c.onpagehide||null===c.onpagehide?g.c.addListener(c,
"pageshow",l.C):g.c.addListener(c,"load",l.C));g.c.addListener(c,"DOMContentLoaded",function(){b.fireEvent("dom_loaded")});(function(){function a(){b.fireEvent("visibility_changed")}f.webkitVisibilityState?g.c.addListener(f,"webkitvisibilitychange",a):f.msVisibilityState?g.c.addListener(f,"msvisibilitychange",a):f.visibilityState&&g.c.addListener(f,"visibilitychange",a);g.c.addListener(f,"mouseup",b.pa);c.onpagehide||null===c.onpagehide||g.c.addListener(c,"unload",function(){l.window=c=null})})();
b.Z=!0;return l},C:function(){if(b.n)return l;b.fireEvent("page_ready");b.n=!0;return l},setImmediate:function(a,b,e,g){function f(){a.call(g||null,b,e||{});f=null}c.setImmediate?c.setImmediate(f):c.msSetImmediate?c.msSetImmediate(f):c.webkitSetImmediate?c.webkitSetImmediate(f):c.mozSetImmediate?c.mozSetImmediate(f):setTimeout(f,10)},subscribe:function(a,e,f,n){var s,q,t;if(!b.w.hasOwnProperty(a))return l;t=b.w[a];for(s=0;s<t.length;s++)if(q=t[s],q[0]===e&&q[1]===f&&q[2]===n)return l;t.push([e,f||
{},n||null]);"page_ready"===a&&b.n&&l.setImmediate(e,null,f,n);"page_unload"===a&&(a=function(a){e&&e.call(n,a||c.event,f)},c.onpagehide||null===c.onpagehide?g.c.addListener(c,"pagehide",a):g.c.addListener(c,"unload",a),g.c.addListener(c,"beforeunload",a));return l},d:function(a,c){if("string"===typeof a)b.f[a]=c;else if("object"===typeof a)for(var e in a)a.hasOwnProperty(e)&&(b.f[e]=a[e]);return l},ta:function(a){var c,e;if(!arguments.length)return l;e=1===arguments.length&&"[object Array]"===Object.prototype.toString.apply(a)?
a:arguments;for(c=0;c<e.length;c++)b.f.hasOwnProperty(e[c])&&delete b.f[e[c]];return l},X:function(){return b.f},ma:function(a){return b.f[a]},removeStats:function(){b.f={};l.plugins.b.ia();return l},D:function(){var a,e,g=0;for(a in l.plugins)if(l.plugins.hasOwnProperty(a)&&!b.t[a]&&!l.plugins[a].A())return l;b.f.v=l.version;b.f.u=f.URL.replace(/#.*/,"");c!==window&&(b.f["if"]="");b.fireEvent("before_beacon",b.f);if(!b.G)return l;e=[];for(a in b.f)b.f.hasOwnProperty(a)&&(g++,e.push(encodeURIComponent(a)+
"="+(void 0===b.f[a]||null===b.f[a]?"":encodeURIComponent(b.f[a]+""))));e=b.G+(-1<b.G.indexOf("?")?"&":"?")+e.join("&");l.debug("Sending url: "+e.replace(/&/g,"\n\t"));g&&(a=new Image,a.src=e);return l},va:function(a){b.beacon_url=a}};g.m="number"===typeof e.BOOMR_lstart?e.BOOMR_lstart:0;delete e.BOOMR_lstart;(function(){function a(b){return function(a,c){l.log(a,b,"boomerang"+(c?"."+c:""));return l}}g.debug=a("debug");g.info=a("info");g.warn=a("warn");g.error=a("error")})();c.F&&c.F.Ba&&c.F.Ba.Ca?
g.log=c.F.log:c.R&&c.R.log?g.log=c.R.log:"object"===typeof c.console&&void 0!==c.console.log&&(g.log=function(a,b,e){c.console.log(e+": ["+b+"] "+a)});for(a in g)g.hasOwnProperty(a)&&(l[a]=g[a]);l.plugins=l.plugins||{}}})(window);(function(c){var f=c.document;l=l||{};l.plugins=l.plugins||{};var a={aa:!1,n:!1,Ia:!1,complete:!1,a:{},cookie:"RT",ja:1800,za:!1,navigationType:0,navigationStart:void 0,responseStart:void 0,N:Math.floor(4294967296*Math.random()).toString(36),l:void 0,O:0,g:void 0,q:void 0,k:void 0,p:void 0,setCookie:function(b,c){var e,h;if(!a.cookie)return a;e=l.c.V(l.c.J(a.cookie))||{};"ul"===b&&(e.k=f.URL.replace(/#.*/,""));"cl"===b&&(c?e.K=c:e.K&&delete e.K);!1===c&&delete e.K;h=(new Date).getTime();b&&(e[b]=
h);l.debug("Setting cookie "+l.c.B(e),"rt");if(!l.c.setCookie(a.cookie,e,a.ja))return l.error("cannot set start cookie","rt"),a;e=(new Date).getTime();50<e-h&&(l.c.sa(a.cookie),l.error("took more than 50ms to set cookie... aborting: "+h+" -> "+e,"rt"));return a},$:function(){var b;a.cookie&&(b=l.c.V(l.c.J(a.cookie)))&&(b.s=Math.max(+b.ul||0,+b.cl||0),l.debug("Read from cookie "+l.c.B(b),"rt"),b.s&&b.r&&(a.k=b.r,l.debug(a.k+" =?= "+a.p,"rt"),l.debug(b.s+" <? "+(+b.cl+15),"rt"),l.debug(b.nu+" =?= "+
f.URL.replace(/#.*/,""),"rt"),!a.za||a.k===a.p||b.s<+b.cl+15&&b.nu===f.URL.replace(/#.*/,"")?(a.g=b.s,+b.hd>b.s&&(a.q=parseInt(b.hd,10))):a.g=a.q=void 0),b.wa&&(a.N=b.wa),b.ya&&(a.l=parseInt(b.ya,10)),b.xa&&(a.O=parseInt(b.xa,10)))},ha:function(){if(!(f.webkitVisibilityState&&"prerender"===f.webkitVisibilityState||f.msVisibilityState&&3===f.msVisibilityState))return!1;l.plugins.b.o("t_load",a.navigationStart);l.plugins.b.e("t_load");l.plugins.b.o("t_prerender",a.navigationStart);l.plugins.b.o("t_postrender");
l.subscribe("visibility_changed",l.plugins.b.h,null,l.plugins.b);return!0},na:function(){var b,e,f;a.navigationStart||((e=c.performance||c.msPerformance||c.webkitPerformance||c.mozPerformance)&&e.navigation&&(a.navigationType=e.navigation.type),e&&e.timing?b=e.timing:c.H&&c.H.csi&&c.H.csi().startE?(b={navigationStart:c.H.csi().startE},f="csi"):c.Y&&c.Y.startE()&&(b={navigationStart:c.Y.startE()},f="gtb"),b?(l.d("rt.start",f||"navigation"),a.navigationStart=b.navigationStart||b.fetchStart||void 0,
a.responseStart=b.responseStart||void 0,navigator.userAgent.match(/Firefox\/[78]\./)&&(a.navigationStart=b.unloadEventStart||b.fetchStart||void 0)):l.warn("This browser doesn't support the WebTiming API","rt"))},qa:function(b){l.debug("Unload called with "+l.c.B(b),"rt");a.setCookie("beforeunload"===b.type?"ul":"hd")},onclick:function(b){if(b){for(l.debug("Click called with "+b.nodeName,"rt");b&&"A"!==b.nodeName.toUpperCase();)b=b.parentNode;b&&"A"===b.nodeName.toUpperCase()&&(l.debug("passing through",
"rt"),a.setCookie("cl",b.href))}},ka:function(){l.plugins.b.e("t_domloaded")},onLoad:function(){l.plugins.b.e("t_onLoad")}},e=l.plugins.b={j:function(b){l.debug("init RT","rt");c!==l.window&&(c=l.window,f=c.document);l.c.ra(a,b,"RT",["cookie","cookie_exp","strict_referrer"]);a.$();if(a.aa)return e;a.complete=!1;a.a={};l.subscribe("page_ready",e.h,null,e);l.subscribe("dom_loaded",a.ka,null,a);l.subscribe("page_unload",a.qa,null,a);l.subscribe("click",a.onclick,null,a);l.subscribe("onLoad",a.onLoad,
null,a);l.g&&(e.o("boomerang",l.g),e.e("boomerang",l.da),e.e("boomr_fb",l.g),l.m&&(e.e("kylie_ld",l.m),e.setTimer("kylie_lat",l.g-l.m,l.m)));a.k=a.p=f.referrer.replace(/#.*/,"");a.l||(a.l=l.m||l.g);a.aa=!0;return e},o:function(b,c){b&&("t_page"===b&&e.e("t_resp",c),a.a[b]={start:"number"===typeof c?c:(new Date).getTime()},a.complete=!1);return e},e:function(b,c){b&&(a.a[b]=a.a[b]||{},void 0===a.a[b].end&&(a.a[b].end="number"===typeof c?c:(new Date).getTime()));return e},setTimer:function(b,c,f){b&&
(a.a[b]={i:c,start:f});return e},Aa:function(b,c){b&&(a.a[c]=a.a[b],a.a[b]={})},ia:function(){a.a={};return e},Q:function(){if(a.a){var b,c;for(c in a.a)a.a.hasOwnProperty(c)&&(b=a.a[c],b.end&&b.start&&("number"!==typeof b.i&&(b.i=b.end-b.start),l.d(c,b.i)))}},W:function(){return a.a},startTransaction:function(a){return l.plugins.b.o("txn_"+a,(new Date).getTime())},endTransaction:function(a){return l.plugins.b.e("txn_"+a,(new Date).getTime())},la:function(){return a.N},U:function(){return a.l},Fa:function(){return a.n},
h:function(){l.debug("Called done","rt");var b,c=(new Date).getTime(),f=0,h,k=[];a.complete=!1;a.$();a.na();if(a.ha())return e;a.responseStart?(e.e("t_resp",a.responseStart),a.a.t_load?e.setTimer("t_page",a.a.t_load.end-a.responseStart,a.responseStart):(b=c-a.responseStart,0<b&&e.setTimer("t_page",b,a.responseStart))):a.a.hasOwnProperty("t_page")?e.e("t_page"):a.q&&(e.e("t_resp",a.q),e.setTimer("t_page",c-a.q));a.a.hasOwnProperty("t_postrender")&&(e.e("t_postrender"),e.e("t_prerender"));a.navigationStart?
b=a.navigationStart:a.g&&2!==a.navigationType?(b=a.g,l.d("rt.start","cookie")):(l.d("rt.start","none"),b=void 0);b&&a.l>b&&(a.l=l.m||l.g,a.O=0);e.e("t_done",c);l.ta("t_done","t_page","t_resp","r","r2","rt.tstart","rt.bstart","rt.end","rt.ss","rt.sl","rt.lt","t_postrender","t_prerender","t_load");l.d("rt.tstart",b);l.d("rt.bstart",l.g);l.d("rt.end",a.a.t_done.end);a.a.t_configfb&&("t_configfb"in a.a&&"number"!=typeof a.a.t_configfb.start||isNaN(a.a.t_configfb.start))&&("t_configjs"in a.a&&"number"==
typeof a.a.t_configjs.start?a.a.t_configfb.start=a.a.t_configjs.start:delete a.a.t_configfb);for(h in a.a)a.a.hasOwnProperty(h)&&(c=a.a[h],"number"!==typeof c.i&&("number"!==typeof c.start&&(c.start=b),c.i=c.end-c.start),isNaN(c.i)||(l.d(h,c.i),f++));f&&(l.d("r",a.k),a.p!==a.k&&l.d("r2",a.p),k.length&&l.d("t_other",k.join(",")));l.d({"rt.sid":a.N,"rt.ss":a.l,"rt.sl":a.O});a.a={};a.complete=!0;l.D();return e},A:function(){return a.complete}}})(window);(function(){l=l||{};l.plugins=l.plugins||{};var c={complete:!1,h:function(){var a=l.window,e=a.performance,b=a.console,f=a.document,m="[object Opera]"==={}.toString.call(a.opera)?f.querySelectorAll:f.getElementsByTagName,a=void 0===m.call?function(a){return m(a)}:m;(e=e&&e.memory?e.memory:b&&b.memory?b.memory:null)&&l.d({"mem.total":e.totalJSHeapSize,"mem.used":e.usedJSHeapSize});l.d({"dom.ln":a.call(f,"*").length,"dom.sz":a.call(f,"html")[0].innerHTML.length,"dom.img":a.call(f,"img").length,"dom.script":a.call(f,
"script").length});c.complete=!0;l.D()}},f=l.plugins.Da={j:function(){l.subscribe("page_ready",c.h,null,c);return f},A:function(){return c.complete}}})();(function(){l=l||{};l.plugins=l.plugins||{};var c={complete:!1,h:function(){var a=l.window,e,b;(e=a.performance||a.msPerformance||a.webkitPerformance||a.mozPerformance)&&e.timing&&e.navigation&&(l.info("This user agent supports NavigationTiming.","nt"),b=e.navigation,e=e.timing,b={nt_red_cnt:b.redirectCount,nt_nav_type:b.type,nt_nav_st:e.navigationStart,nt_red_st:e.redirectStart,nt_red_end:e.redirectEnd,nt_fet_st:e.fetchStart,nt_dns_st:e.domainLookupStart,nt_dns_end:e.domainLookupEnd,nt_con_st:e.connectStart,
nt_con_end:e.connectEnd,nt_req_st:e.requestStart,nt_res_st:e.responseStart,nt_res_end:e.responseEnd,nt_domloading:e.domLoading,nt_domint:e.domInteractive,nt_domcontloaded_st:e.domContentLoadedEventStart,nt_domcontloaded_end:e.domContentLoadedEventEnd,nt_domcomp:e.domComplete,nt_load_st:e.loadEventStart,nt_load_end:e.loadEventEnd,nt_unload_st:e.unloadEventStart,nt_unload_end:e.unloadEventEnd},e.secureConnectionStart&&(b.nt_ssl_st=e.secureConnectionStart),e.oa&&(b.nt_first_paint=e.oa),l.d(b));a.chrome&&
a.chrome.loadTimes&&(e=a.chrome.loadTimes())&&(b={nt_spdy:e.wasFetchedViaSpdy?1:0,nt_first_paint:e.firstPaintTime},l.d(b));c.complete=!0;l.D()}},f=l.plugins.Ea={j:function(){l.subscribe("page_ready",c.h,null,c);return f},A:function(){return c.complete}}})();l.d("mob.ct","object"===typeof navigator&&navigator.connection?navigator.connection.type:0);(function(){l=l||{};l.plugins=l.plugins||{};var c={T:l.window.document,ba:"script",complete:!1,M:!1,P:void 0,h:function(){c.complete||(c.complete=!0,c.M=!1,l.D())},ua:function(){var a=c.T.getElementsByTagName(c.ba)[0],e=c.T.createElement(c.ba);c.P=(new Date).getTime();e.src=l.window.BOOMR_cURL;a.parentNode.insertBefore(e,a)}},f=l.plugins.fa={j:function(){if(c.complete)return f;if(c.M)return setTimeout(c.h,10),l.d("t_cjs",(new Date).getTime()-c.P),p.BOOMR_configt&&(l.d("t_cfb",p.BOOMR_configt-c.P),
delete p.BOOMR_configt),null;c.M=!0;l.subscribe("page_ready",c.ua,null,null);return f},A:function(){return c.complete}}})();l.j({log:null,Ja:!0,fa:{enabled:!1},S:!1});l.da=(new Date).getTime();var r={DEBUG:{name:"DEBUG",value:1},INTERNAL:{name:"INTERNAL",value:2},PRODUCTION:{name:"PRODUCTION",value:3}},u={PAGE_START_MARK:"PageStart",PERF_PAYLOAD_PARAM:"bulkPerf",MARK_NAME:"mark",MEASURE_NAME:"measure",MARK_START_TIME:"st",MARK_LAST_TIME:"lt",PAGE_NAME:"pn",ELAPSED_TIME:"et",REFERENCE_TIME:"rt",Perf_LOAD_DONE:"loadDone",STATS:{NAME:"stat",SERVER_ELAPSED:"internal_serverelapsed",DB_TOTAL_TIME:"internal_serverdbtotaltime",DB_CALLS:"internal_serverdbcalls",DB_FETCHES:"internal_serverdbfetches"}};
window.PerfConstants=u;window.PerfLogLevel=r;var p=window.perfOptions;p?(p.L||(p.L=(new Date).getTime()),p.ga&&l.va(p.ga)):p={L:(new Date).getTime()};var v=null;function w(c){"string"===typeof c&&(c=r[c]);return c||r.INTERNAL}function x(c,f){l.plugins.b.Aa(c,f);return y}
var y={I:w(p.Ga),startTime:p.L,mark:function(c,f){y.I.value<=w(f).value&&l.plugins.b.o(c);return y},endMark:function(c,f){y.I.value<=w(f).value&&l.plugins.b.e(c);return y},updateMarkName:x,setTimer:function(c,f,a){y.I.value<=w(a).value&&(0<=f?l.plugins.b.setTimer(c,f):l.plugins.b.e(c));return y},measureToJson:function(c){return"{"+u.MEASURE_NAME+':"'+c[u.MEASURE_NAME]+'",'+u.MARK_NAME+':"'+c[u.MARK_NAME]+'",'+u.ELAPSED_TIME+":"+c[u.ELAPSED_TIME]+","+u.REFERENCE_TIME+":"+c[u.REFERENCE_TIME]+"}"},toJson:function(c){l.plugins.b.Q();
var f=l.plugins.b.W(),a=l.plugins.b.U(),e=["{",'sessionID:"',l.plugins.b.la(),'",',"st:",a,",",'pn:"',window.document.URL,'",','uid:"',Math.round(1E15*Math.random()),'",'],b=[],g=[],m,h,k=l.X(),n;for(m in k)"r"!=m&&"r2"!=m&&"t_other"!=m&&k.hasOwnProperty(m)&&!isNaN(k[m])&&(c&&b.push('"'+m+'":'+k[m]),h={},h[u.MEASURE_NAME]=m,h[u.MARK_NAME]=m,h[u.ELAPSED_TIME]=k[m],n=f[m],h[u.REFERENCE_TIME]=n&&n.start?n.start:a,g.push(y.measureToJson(h)));c&&e.push("marks:{",b.join(","),"},");e.push("measures:[",g.join(","),
"]}");return e.join("")},toPostVar:function(){return u.PERF_PAYLOAD_PARAM+"="+y.toJson().replace(/&/g,"__^__")},getMeasures:function(){l.plugins.b.Q();var c=l.plugins.b.W(),f=l.plugins.b.U(),a=[],e=l.X(),b,g;for(b in e)"r"!=b&&"r2"!=b&&"t_other"!=b&&e.hasOwnProperty(b)&&!isNaN(e[b])&&(g={},g[u.MEASURE_NAME]=b,g[u.MARK_NAME]=b,g[u.ELAPSED_TIME]=e[b],g[u.REFERENCE_TIME]=c[b]?c[b].start:f,a.push(g));return a},getBeaconData:function(){return v},setBeaconData:function(c){v=c},clearBeaconData:function(){v=
null},removeStats:l.removeStats,subscribe:l.subscribe,stat:function(c,f){l.d("st_"+c,f);return y},getStat:function(c){l.plugins.b.Q();return c?l.ma(c):-1},onLoad:l.C,startTransaction:function(c){l.plugins.b.startTransaction(c);return y},endTransaction:function(c){l.plugins.b.endTransaction(c);return y},updateTransaction:x,onLoadFired:l.plugins.b.onLoadFired,util:{setCookie:function(c,f,a,e){document.cookie=c+"="+escape(f+"")+(a?"; expires="+a.toGMTString():"")+(e?"; path="+e:"; path=/")}},enabled:!0};
window.Perf=y;window.Kylie=y;window.PerfLogLevel=r;window.PerfConstants=u;})(this);
/*
//@ sourceMappingURL=perf.js.map
*/
