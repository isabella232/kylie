this.Perf&&void 0!==this.Perf.enabled||(function(window){'use strict';function IBOOMR() {
}
IBOOMR.prototype.version;
IBOOMR.prototype.window;
IBOOMR.prototype.t_lstart;
IBOOMR.prototype.t_start;
IBOOMR.prototype.sendBeacon;
IBOOMR.prototype.page_ready;
IBOOMR.prototype.addVar;
IBOOMR.prototype.removeVar;
IBOOMR.prototype.getVars;
IBOOMR.prototype.getVar;
IBOOMR.prototype.removeStats;
IBOOMR.prototype.setImmediate;
IBOOMR.prototype.setBeaconUrl;
IBOOMR.prototype.debug;
IBOOMR.prototype.info;
IBOOMR.prototype.warn;
IBOOMR.prototype.error;
IBOOMR.prototype.subscribe;
IBOOMR.prototype.init;
function IBOOMR_utils() {
}
IBOOMR.prototype.utils;
IBOOMR_utils.prototype.objectToString;
IBOOMR_utils.prototype.getCookie;
IBOOMR_utils.prototype.setCookie;
IBOOMR_utils.prototype.removeCookie;
IBOOMR_utils.prototype.pluginConfig;
IBOOMR_utils.prototype.getSubCookies;
IBOOMR_utils.prototype.hashQueryString;
IBOOMR_utils.prototype.cleanupURL;
IBOOMR_utils.prototype.MD5;
function IPlugin() {
}
IPlugin.prototype.init;
IPlugin.prototype.is_complete;
/*
 Copyright (c) 2011, Yahoo! Inc.  All rights reserved.
 Copyright (c) 2012, Log-Normal, Inc.  All rights reserved.
 Copyright (c) 2013, SOASTA, Inc. All rights reserved.
 Copyright (c) 2013, Salesforce.com. All rights reserved.
 Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.
*/
var BOOMR_start = (new Date).getTime();
function BOOMR_check_doc_domain(domain) {
  var test;
  if (!domain) {
    if (window["parent"] === window || !document.getElementById("boomr-if-as")) {
      return true;
    }
    domain = document["domain"];
  }
  if (domain.indexOf(".") === -1) {
    return false;
  }
  try {
    test = window["parent"]["document"];
    return true;
  } catch (err) {
    document["domain"] = domain;
  }
  try {
    test = window["parent"]["document"];
    return true;
  } catch (err) {
    domain = domain.replace(/^[\w-]+\./, "");
  }
  return BOOMR_check_doc_domain(domain);
}
BOOMR_check_doc_domain();
var BOOMR;
var BEACON_URL = "";
var VERSION = "";
function run(w) {
  var myurl;
  if (w.parent !== w && (document.getElementById("boomr-if-as") && document.getElementById("boomr-if-as").nodeName.toLowerCase() === "script")) {
    w = w.parent;
    myurl = document.getElementById("boomr-if-as").src;
  }
  var d = w.document;
  var perfOptions = w["perfOptions"] || {};
  var impl = {beacon_url:BEACON_URL, beacon_type:"AUTO", site_domain:w.location.hostname.replace(/.*?([^.]+\.[^.]+)\.?$/, "$1").toLowerCase(), user_ip:"", strip_query_string:false, onloadfired:false, handlers_attached:false, events:{"page_ready":[], "page_unload":[], "dom_loaded":[], "onLoad":[], "visibility_changed":[], "before_beacon":[], "xhr_load":[], "click":[], "form_submit":[]}, vars:{}, disabled_plugins:{}, onclick_handler:function(ev) {
    var target;
    if (!ev) {
      ev = w.event;
    }
    if (ev.target) {
      target = ev.target;
    } else {
      if (ev.srcElement) {
        target = ev.srcElement;
      }
    }
    if (!target || target.nodeName.toUpperCase() === "OBJECT" && target.type === "application/x-shockwave-flash") {
      return;
    }
    if (target.nodeType === 3) {
      target = target.parentNode;
    }
    impl.fireEvent("click", target);
  }, onsubmit_handler:function(ev) {
    var target;
    if (!ev) {
      ev = w.event;
    }
    if (ev.target) {
      target = ev.target;
    } else {
      if (ev.srcElement) {
        target = ev.srcElement;
      }
    }
    if (target.nodeType === 3) {
      target = target.parentNode;
    }
    impl.fireEvent("form_submit", target);
  }, fireEvent:function(e_name, data) {
    var i, h, e;
    if (!impl.events.hasOwnProperty(e_name)) {
      return false;
    }
    e = impl.events[e_name];
    for (i = 0;i < e.length;i++) {
      h = e[i];
      h[0].call(h[2], data, h[1]);
    }
    return true;
  }};
  var boomr = {t_lstart:null, t_start:BOOMR_start, url:myurl, t_end:null, plugins:{}, version:VERSION, window:w, utils:{objectToString:function(o, separator) {
    var value = [], l;
    if (!o || typeof o !== "object") {
      return o;
    }
    if (separator === undefined) {
      separator = "\n\t";
    }
    for (l in o) {
      if (Object.prototype.hasOwnProperty.call(o, l)) {
        value.push(encodeURIComponent(l) + "=" + encodeURIComponent(o[l]));
      }
    }
    return value.join(separator);
  }, getCookie:function(name) {
    if (!name) {
      return null;
    }
    name = " " + name + "=";
    var i, cookies;
    cookies = " " + d.cookie + ";";
    if ((i = cookies.indexOf(name)) >= 0) {
      i += name.length;
      cookies = cookies.substring(i, cookies.indexOf(";", i));
      return cookies;
    }
    return null;
  }, setCookie:function(name, subcookies, max_age) {
    var value, nameval, c, exp;
    if (!name || !impl.site_domain) {
      boomr.debug("No cookie name or site domain: " + name + "/" + impl.site_domain);
      return false;
    }
    value = boomr.utils.objectToString(subcookies, "&");
    nameval = name + "=" + value;
    c = [nameval, "path=/", "domain=" + impl.site_domain];
    if (max_age) {
      exp = new Date;
      exp.setTime(exp.getTime() + max_age * 1E3);
      exp = exp.toGMTString();
      c.push("expires=" + exp);
    }
    if (nameval.length < 500) {
      d.cookie = c.join("; ");
      var savedVal = boomr.utils.getCookie(name);
      if (value === savedVal) {
        return true;
      }
      boomr.warn("Saved cookie value doesn't match what we tried to set:\n" + value + "\n" + savedVal);
    } else {
      boomr.warn("Cookie too long: " + nameval.length + " " + nameval);
    }
    return false;
  }, getSubCookies:function(cookie) {
    var cookies_a, i, l, kv, gotcookies = false, cookies = {};
    if (!cookie) {
      return null;
    }
    if (typeof cookie !== "string") {
      boomr.debug("TypeError: cookie is not a string: " + typeof cookie);
      return null;
    }
    cookies_a = cookie.split("&");
    for (i = 0, l = cookies_a.length;i < l;i++) {
      kv = cookies_a[i].split("=");
      if (kv[0]) {
        kv.push("");
        cookies[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        gotcookies = true;
      }
    }
    return gotcookies ? cookies : null;
  }, removeCookie:function(name) {
    return boomr.utils.setCookie(name, {}, -86400);
  }, cleanupURL:function(url) {
    if (impl.strip_query_string && url) {
      return url.replace(/\?.*/, "?qs-redacted");
    }
    return url;
  }, hashQueryString:function(url, stripHash) {
    if (!url) {
      return url;
    }
    if (stripHash) {
      url = url.replace(/#.*/, "");
    }
    if (!boomr.utils.MD5) {
      return url;
    }
    return url.replace(/\?([^#]*)/, function(m0, m1) {
      return "?" + (m1.length > 10 ? boomr.utils.MD5(m1) : m1);
    });
  }, pluginConfig:function(o, config, plugin_name, properties) {
    var i, props = 0;
    if (!config || !config[plugin_name]) {
      return false;
    }
    for (i = 0;i < properties.length;i++) {
      if (config[plugin_name][properties[i]] !== undefined) {
        o[properties[i]] = config[plugin_name][properties[i]];
        props++;
      }
    }
    return props > 0;
  }, addListener:function(el, type, fn) {
    if (el.addEventListener) {
      el.addEventListener(type, fn, false);
    } else {
      el.attachEvent("on" + type, fn);
    }
  }, removeListener:function(el, type, fn) {
    if (el.removeEventListener) {
      el.removeEventListener(type, fn, false);
    } else {
      el.detachEvent("on" + type, fn);
    }
  }, pushVars:function(arr, vars, prefix) {
    var k, i, n = 0;
    for (k in vars) {
      if (vars.hasOwnProperty(k)) {
        if (Object.prototype.toString.call(vars[k]) === "[object Array]") {
          for (i = 0;i < vars[k].length;++i) {
            n += boomr.utils.pushVars(arr, vars[k][i], k + "[" + i + "]");
          }
        } else {
          ++n;
          arr.push(encodeURIComponent(prefix ? prefix + "[" + k + "]" : k) + "=" + (vars[k] === undefined || vars[k] === null ? "" : encodeURIComponent(vars[k])));
        }
      }
    }
    return n;
  }, postData:function(urlenc) {
    var iframe = document.createElement("iframe"), form = document.createElement("form"), input = document.createElement("input");
    iframe.name = "boomerang_post";
    iframe.style.display = form.style.display = "none";
    form.method = "POST";
    form.action = impl.beacon_url;
    form.target = iframe.name;
    input.name = "data";
    if (window["JSON"]) {
      form.enctype = "text/plain";
      input.value = JSON.stringify(impl.vars);
    } else {
      form.enctype = "application/x-www-form-urlencoded";
      input.value = urlenc;
    }
    document.body.appendChild(iframe);
    form.appendChild(input);
    document.body.appendChild(form);
    boomr.utils.addListener(iframe, "load", function() {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    });
    form.submit();
  }}, init:function(config) {
    var i, l, properties = ["beacon_url", "beacon_type", "site_domain", "user_ip", "strip_query_string"];
    BOOMR_check_doc_domain();
    if (!config) {
      config = {};
    }
    for (i = 0;i < properties.length;i++) {
      if (config[properties[i]] !== undefined) {
        impl[properties[i]] = config[properties[i]];
      }
    }
    if (config.log !== undefined) {
      boomr.log = config.log;
    }
    if (!boomr.log) {
      boomr.log = function() {
      };
    }
    for (l in boomr.plugins) {
      if (boomr.plugins.hasOwnProperty(l)) {
        if (config[l] && (config[l].hasOwnProperty("enabled") && config[l].enabled === false)) {
          impl.disabled_plugins[l] = 1;
          continue;
        }
        if (impl.disabled_plugins[l]) {
          delete impl.disabled_plugins[l];
        }
        if (typeof boomr.plugins[l].init === "function") {
          boomr.plugins[l].init(config);
        }
      }
    }
    if (impl.handlers_attached) {
      return boomr;
    }
    if (!impl.onloadfired && (config.autorun === undefined || config.autorun !== false)) {
      if (d.readyState && d.readyState === "complete") {
        boomr.setImmediate(boomr.page_ready, null, null, boomr);
      } else {
        if (w["onpagehide"] || w["onpagehide"] === null) {
          boomr.utils.addListener(w, "pageshow", boomr.page_ready);
        } else {
          boomr.utils.addListener(w, "load", boomr.page_ready);
        }
      }
    }
    boomr.utils.addListener(w, "DOMContentLoaded", function() {
      impl.fireEvent("dom_loaded");
    });
    (function() {
      var fire_visible, forms, iterator;
      fire_visible = function() {
        impl.fireEvent("visibility_changed");
      };
      if (d["webkitVisibilityState"]) {
        boomr.utils.addListener(d, "webkitvisibilitychange", fire_visible);
      } else {
        if (d["msVisibilityState"]) {
          boomr.utils.addListener(d, "msvisibilitychange", fire_visible);
        } else {
          if (d.visibilityState) {
            boomr.utils.addListener(d, "visibilitychange", fire_visible);
          }
        }
      }
      boomr.utils.addListener(d, "mouseup", impl.onclick_handler);
      forms = d.getElementsByTagName("form");
      for (iterator = 0;iterator < forms.length;iterator++) {
        boomr.utils.addListener(forms[iterator], "submit", impl.onsubmit_handler);
      }
      if (!w["onpagehide"] && w["onpagehide"] !== null) {
        boomr.utils.addListener(w, "unload", function() {
          delete boomr.window;
        });
      }
    })();
    impl.handlers_attached = true;
    return boomr;
  }, page_ready:function(ev) {
    var ev2 = ev;
    if (!ev2) {
      ev2 = w.event;
    }
    if (!ev2) {
      ev2 = {name:"load"};
    }
    if (impl.onloadfired) {
      return boomr;
    }
    impl.fireEvent("page_ready", ev2);
    impl.onloadfired = true;
    return boomr;
  }, setImmediate:function(fn, data, cb_data, cb_scope) {
    var cb = function() {
      fn.call(cb_scope || null, data, cb_data || {});
      cb = null;
    };
    if (w.setImmediate) {
      w.setImmediate(cb);
    } else {
      if (w["msSetImmediate"]) {
        w["msSetImmediate"](cb);
      } else {
        if (w["webkitSetImmediate"]) {
          w["webkitSetImmediate"](cb);
        } else {
          if (w["mozSetImmediate"]) {
            w["mozSetImmediate"](cb);
          } else {
            setTimeout(cb, 10);
          }
        }
      }
    }
  }, subscribe:function(e_name, fn, cb_data, cb_scope) {
    var i, h, e, unload_handler;
    if (!impl.events.hasOwnProperty(e_name)) {
      return boomr;
    }
    e = impl.events[e_name];
    for (i = 0;i < e.length;i++) {
      h = e[i];
      if (h[0] === fn && (h[1] === cb_data && h[2] === cb_scope)) {
        return boomr;
      }
    }
    e.push([fn, cb_data || {}, cb_scope || null]);
    if (e_name === "page_ready" && impl.onloadfired) {
      boomr.setImmediate(fn, null, cb_data, cb_scope);
    }
    if (e_name === "page_unload") {
      unload_handler = function(ev) {
        if (fn) {
          fn.call(cb_scope, ev || w.event, cb_data);
        }
      };
      if (w["onpagehide"] || w["onpagehide"] === null) {
        boomr.utils.addListener(w, "pagehide", unload_handler);
      } else {
        boomr.utils.addListener(w, "unload", unload_handler);
      }
      boomr.utils.addListener(w, "beforeunload", unload_handler);
    }
    return boomr;
  }, addVar:function(name, value) {
    if (typeof name === "string") {
      impl.vars[name] = value;
    } else {
      if (typeof name === "object") {
        var o = name, l;
        for (l in o) {
          if (o.hasOwnProperty(l)) {
            impl.vars[l] = o[l];
          }
        }
      }
    }
    return boomr;
  }, removeVar:function(arg0) {
    var i, params;
    if (!arguments.length) {
      return boomr;
    }
    if (arguments.length === 1 && Object.prototype.toString.apply(arg0) === "[object Array]") {
      params = arg0;
    } else {
      params = arguments;
    }
    for (i = 0;i < params.length;i++) {
      if (impl.vars["hasOwnProperty"](params[i])) {
        delete impl.vars[params[i]];
      }
    }
    return boomr;
  }, getVars:function() {
    return impl.vars;
  }, getVar:function(name) {
    return impl.vars[name];
  }, removeStats:function() {
    impl.vars = {};
    boomr.plugins.RT.clearTimers();
    return boomr;
  }, requestStart:function(name) {
    var t_start = (new Date).getTime();
    boomr.plugins.RT.startTimer("xhr_" + name, t_start);
    return{loaded:function() {
      boomr.responseEnd(name, t_start);
    }};
  }, responseEnd:function(name, t_start) {
    boomr.plugins.RT.startTimer("xhr_" + name, t_start);
    impl.fireEvent("xhr_load", {"name":"xhr_" + name});
  }, sendBeacon:function() {
    var l, data, url, img, nparams;
    boomr.debug("Checking if we can send beacon");
    for (l in boomr.plugins) {
      if (boomr.plugins.hasOwnProperty(l)) {
        if (impl.disabled_plugins[l]) {
          continue;
        }
        if (!boomr.plugins[l].is_complete()) {
          BOOMR.debug("Plugin " + l + " is not complete, deferring beacon send");
          return boomr;
        }
      }
    }
    impl.vars["v"] = boomr.version;
    impl.vars["u"] = boomr.utils.cleanupURL(d.URL.replace(/#.*/, ""));
    if (w !== window) {
      impl.vars["if"] = "";
    }
    impl.fireEvent("before_beacon", impl.vars);
    if (!impl.beacon_url) {
      return boomr;
    }
    data = [];
    nparams = boomr.utils.pushVars(data, impl.vars);
    if (!nparams) {
      return boomr;
    }
    data = data.join("&");
    if (impl.beacon_type === "POST") {
      boomr.utils.postData(data);
    } else {
      url = impl.beacon_url + (impl.beacon_url.indexOf("?") > -1 ? "&" : "?") + data;
      if (url.length > 2E3 && impl.beacon_type === "AUTO") {
        boomr.utils.postData(data);
      } else {
        boomr.debug("Sending url: " + url.replace(/&/g, "\n\t"));
        img = new Image;
        img.src = url;
      }
    }
    return boomr;
  }};
  if (typeof perfOptions["BOOMR_lstart"] === "number") {
    boomr.t_lstart = perfOptions["BOOMR_lstart"];
  } else {
    if (boomr.window["perfOptions"] && typeof boomr.window["perfOptions"]["BOOMR_lstart"] === "number") {
      boomr.t_lstart = boomr.window["perfOptions"]["BOOMR_lstart"];
    } else {
      boomr.t_lstart = 0;
    }
  }
  delete perfOptions["BOOMR_lstart"];
  (function() {
    if (w.YAHOO && (w.YAHOO.widget && w.YAHOO.widget.Logger)) {
      boomr.log = w.YAHOO.log;
    } else {
      if (w.Y && w.Y.log) {
        boomr.log = w.Y.log;
      } else {
        if (typeof window.console === "object" && window.console.log !== undefined) {
          boomr.log = function(m, l, s) {
            window.console.log(s + ": [" + l + "] " + m);
          };
        }
      }
    }
    function make_logger(l) {
      return function(m, s) {
        boomr.log(m, l, "boomerang" + (s ? "." + s : ""));
        return boomr;
      };
    }
    boomr.debug = make_logger("debug");
    boomr.info = make_logger("info");
    boomr.warn = make_logger("warn");
    boomr.error = make_logger("error");
  })();
  BOOMR = boomr;
}
run(window);
function runrt(w) {
  var d = w.document;
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {initialized:false, onloadfired:false, visiblefired:false, complete:false, timers:{}, cookie:"RT", cookie_exp:1800, strict_referrer:false, navigationType:0, redirectCount:0, navigationStart:undefined, responseStart:undefined, ti:undefined, sessionID:Math.floor(Math.random() * 4294967296).toString(36), sessionStart:undefined, sessionLength:0, t_start:undefined, t_fb_approx:undefined, r:null, r2:null, updateCookie:function(params, timer) {
    var t_end, t_start, subcookies, k;
    if (!impl.cookie) {
      return impl;
    }
    subcookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie)) || {};
    if (typeof params === "object") {
      for (k in params) {
        if (params.hasOwnProperty(k)) {
          if (params[k] === undefined) {
            if (subcookies.hasOwnProperty(k)) {
              delete subcookies[k];
            }
          } else {
            if (k === "nu" || k === "r") {
              params[k] = BOOMR.utils.hashQueryString(params[k], true);
            }
            subcookies[k] = params[k];
          }
        }
      }
    }
    t_start = (new Date).getTime();
    if (timer) {
      subcookies[timer] = t_start;
    }
    BOOMR.debug("Setting cookie (timer=" + timer + ")\n" + BOOMR.utils.objectToString(subcookies), "rt");
    if (!BOOMR.utils.setCookie(impl.cookie, subcookies, impl.cookie_exp)) {
      BOOMR.error("cannot set start cookie", "rt");
      return impl;
    }
    t_end = (new Date).getTime();
    if (t_end - t_start > 50) {
      BOOMR.utils.removeCookie(impl.cookie);
      BOOMR.error("took more than 50ms to set cookie... aborting: " + t_start + " -> " + t_end, "rt");
    }
    return impl;
  }, initFromCookie:function() {
    var url, subcookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie));
    if (!subcookies) {
      return;
    }
    subcookies["s"] = Math.max(+subcookies["ul"] || 0, +subcookies["cl"] || 0);
    BOOMR.debug("Read from cookie " + BOOMR.utils.objectToString(subcookies), "rt");
    if (subcookies["s"] && (subcookies["r"] || subcookies["nu"])) {
      impl.r = subcookies["r"];
      url = BOOMR.utils.hashQueryString(d.URL, true);
      BOOMR.debug(impl.r + " =?= " + impl.r2, "rt");
      BOOMR.debug(subcookies["s"] + " <? " + (+subcookies["cl"] + 15), "rt");
      BOOMR.debug(subcookies["nu"] + " =?= " + url, "rt");
      if (!impl.strict_referrer || (subcookies["nu"] && (subcookies["nu"] === url && subcookies["s"] < +subcookies["cl"] + 15) || subcookies["s"] === +subcookies["ul"] && impl.r === impl.r2)) {
        impl.t_start = subcookies["s"];
        if (+subcookies["hd"] > subcookies["s"]) {
          impl.t_fb_approx = parseInt(subcookies["hd"], 10);
        }
      } else {
        impl.t_start = impl.t_fb_approx = undefined;
      }
    }
    impl.updateCookie({"s":undefined, "r":undefined, "nu":undefined, "ul":undefined, "cl":undefined, "hd":undefined});
  }, getBoomerangTimings:function() {
    if (BOOMR.t_start) {
      BOOMR.plugins.RT.startTimer("boomerang", BOOMR.t_start);
      BOOMR.plugins.RT.endTimer("boomerang", BOOMR.t_end);
      BOOMR.plugins.RT.endTimer("boomr_fb", BOOMR.t_start);
      if (BOOMR.t_lstart) {
        BOOMR.plugins.RT.endTimer("boomr_ld", BOOMR.t_lstart);
        BOOMR.plugins.RT.setTimer("boomr_lat", BOOMR.t_start - BOOMR.t_lstart, BOOMR.t_lstart);
      }
    }
    if (window.performance && window.performance.getEntriesByName) {
      var res, k, urls = {"rt.bmr.":BOOMR.url}, url;
      for (url in urls) {
        if (urls.hasOwnProperty(url) && urls[url]) {
          res = window.performance.getEntriesByName(urls[url]);
          if (!res || res.length === 0) {
            continue;
          }
          res = res[0];
          for (k in res) {
            if (res.hasOwnProperty(k) && (k.match(/(Start|End)$/) && res[k] > 0)) {
              BOOMR.addVar(url + k.replace(/^(...).*(St|En).*$/, "$1$2"), res[k]);
            }
          }
        }
      }
    }
  }, checkPreRender:function() {
    if (!(d["webkitVisibilityState"] && d["webkitVisibilityState"] === "prerender") && !(d["msVisibilityState"] && d["msVisibilityState"] === 3)) {
      return false;
    }
    BOOMR.plugins.RT.startTimer("t_load", impl.navigationStart);
    BOOMR.plugins.RT.endTimer("t_load");
    BOOMR.plugins.RT.startTimer("t_prerender", impl.navigationStart);
    BOOMR.plugins.RT.startTimer("t_postrender");
    BOOMR.subscribe("visibility_changed", BOOMR.plugins.RT.done, "visible", BOOMR.plugins.RT);
    return true;
  }, initNavTiming:function() {
    var p, source;
    if (impl.navigationStart) {
      return;
    }
    p = w.performance || (w["msPerformance"] || (w["webkitPerformance"] || w["mozPerformance"]));
    if (p && p.navigation) {
      impl.navigationType = p.navigation.type;
      impl.redirectCount = p.navigation.redirectCount;
    }
    if (p && p.timing) {
      impl.ti = p.timing;
    } else {
      if (w.chrome && (w.chrome.csi && w.chrome.csi().startE)) {
        impl.ti = {navigationStart:w.chrome.csi().startE};
        source = "csi";
      } else {
        if (w.gtbExternal && w.gtbExternal.startE()) {
          impl.ti = {navigationStart:w.gtbExternal.startE()};
          source = "gtb";
        }
      }
    }
    if (impl.ti) {
      BOOMR.addVar("rt.start", source || "navigation");
      impl.navigationStart = impl.ti.navigationStart || (impl.ti.fetchStart || undefined);
      impl.responseStart = impl.ti.responseStart || undefined;
      if (navigator.userAgent.match(/Firefox\/[78]\./)) {
        impl.navigationStart = impl.ti.unloadEventStart || (impl.ti.fetchStart || undefined);
      }
    } else {
      BOOMR.warn("This browser doesn't support the WebTiming API", "rt");
    }
  }, getNavTimingOnlyNumbers:function() {
    if (impl.ti.fetchStart !== undefined) {
      BOOMR.plugins.RT.setTimer("t_dns", impl.ti.domainLookupEnd - impl.ti.domainLookupStart, impl.ti.domainLookupStart);
      BOOMR.plugins.RT.setTimer("t_tcp", impl.ti.connectEnd - impl.ti.connectStart, impl.ti.connectStart);
      BOOMR.addVar("nt_nav_type", impl.navigationType);
      BOOMR.addVar("nt_red_cnt", impl.redirectCount);
    }
  }, page_unload:function(edata) {
    BOOMR.debug("Unload called with " + BOOMR.utils.objectToString(edata), "rt");
    impl.updateCookie({"r":d.URL}, edata.type === "beforeunload" ? "ul" : "hd");
  }, _iterable_click:function(name, element, etarget, value_cb) {
    if (!etarget) {
      return;
    }
    BOOMR.debug(name + " called with " + etarget.nodeName, "rt");
    while (etarget && etarget.nodeName.toUpperCase() !== element) {
      etarget = etarget.parentNode;
    }
    if (etarget && etarget.nodeName.toUpperCase() === element) {
      BOOMR.debug("passing through", "rt");
      impl.updateCookie({"nu":value_cb(etarget)}, "cl");
    }
  }, onclick:function(etarget) {
    impl._iterable_click("Click", "A", etarget, function(t) {
      return t.href;
    });
  }, onsubmit:function(etarget) {
    impl._iterable_click("Submit", "FORM", etarget, function(t) {
      var v = t.action || d.URL;
      return v.match(/\?/) ? v : v + "?";
    });
  }, domloaded:function() {
    BOOMR.plugins.RT.endTimer("t_domloaded");
  }, onLoad:function() {
    BOOMR.plugins.RT.endTimer("t_onLoad");
  }};
  var rt = BOOMR.plugins.RT = {init:function(config) {
    BOOMR.debug("init RT", "rt");
    if (w !== BOOMR.window) {
      w = BOOMR.window;
      d = w.document;
    }
    BOOMR.utils.pluginConfig(impl, config, "RT", ["cookie", "cookie_exp", "strict_referrer"]);
    impl.r = impl.r2 = BOOMR.utils.hashQueryString(d.referrer, true);
    impl.initFromCookie();
    impl.getBoomerangTimings();
    if (impl.initialized) {
      return rt;
    }
    impl.complete = false;
    impl.timers = {};
    BOOMR.subscribe("page_ready", rt.done, "load", rt);
    BOOMR.subscribe("dom_loaded", impl.domloaded, null, impl);
    BOOMR.subscribe("page_unload", impl.page_unload, null, impl);
    BOOMR.subscribe("click", impl.onclick, null, impl);
    BOOMR.subscribe("form_submit", impl.onsubmit, null, impl);
    BOOMR.subscribe("onLoad", impl.onLoad, null, impl);
    if (!impl.sessionStart) {
      impl.sessionStart = BOOMR.t_lstart || BOOMR.t_start;
    }
    impl.initialized = true;
    return rt;
  }, startTimer:function(timer_name, time_value) {
    if (timer_name) {
      if (timer_name === "t_page") {
        rt.endTimer("t_resp", time_value);
      }
      impl.timers[timer_name] = {start:typeof time_value === "number" ? time_value : (new Date).getTime()};
    }
    return rt;
  }, endTimer:function(timer_name, time_value) {
    if (timer_name) {
      impl.timers[timer_name] = impl.timers[timer_name] || {};
      if (impl.timers[timer_name].end === undefined) {
        impl.timers[timer_name].end = typeof time_value === "number" ? time_value : (new Date).getTime();
      }
    }
    return rt;
  }, setTimer:function(timer_name, time_delta, time_start) {
    if (timer_name) {
      impl.timers[timer_name] = {delta:time_delta, start:time_start};
    }
    return rt;
  }, updateTimer:function(old_timer, new_timer) {
    if (old_timer) {
      impl.timers[new_timer] = impl.timers[old_timer];
      impl.timers[old_timer] = {};
    }
  }, clearTimers:function() {
    impl.timers = {};
    return rt;
  }, updateVars:function() {
    if (impl.timers) {
      var timer, t_name;
      for (t_name in impl.timers) {
        if (impl.timers.hasOwnProperty(t_name)) {
          timer = impl.timers[t_name];
          if (timer.end && timer.start) {
            if (typeof timer.delta !== "number") {
              timer.delta = timer.end - timer.start;
            }
            BOOMR.addVar(t_name, timer.delta);
          }
        }
      }
    }
  }, getTimers:function() {
    return impl.timers;
  }, startTransaction:function(tName) {
    return BOOMR.plugins.RT.startTimer("txn_" + tName, (new Date).getTime());
  }, endTransaction:function(tName) {
    return BOOMR.plugins.RT.endTimer("txn_" + tName, (new Date).getTime());
  }, getSessionID:function() {
    return impl.sessionID;
  }, getSessionStart:function() {
    return impl.sessionStart;
  }, isOnLoadFired:function() {
    return impl.onloadfired;
  }, setServerTime:function(startTime, delta) {
    rt.startTimer("t_server", startTime).endTimer("t_server", startTime + delta);
  }, done:function(edata, ename) {
    BOOMR.debug("Called done with " + BOOMR.utils.objectToString(edata) + ", " + ename, "rt");
    var t_start, t_done = (new Date).getTime(), ntimers = 0, t_name, timer;
    impl.complete = false;
    impl.initFromCookie();
    impl.initNavTiming();
    if (impl.checkPreRender()) {
      return rt;
    }
    if (impl.responseStart) {
      rt.endTimer("t_resp", impl.responseStart);
      if (impl.timers["t_load"]) {
        rt.setTimer("t_page", impl.timers["t_load"].end - impl.responseStart, impl.responseStart);
      } else {
        var delta = t_done - impl.responseStart;
        if (delta > 0) {
          rt.setTimer("t_page", delta, impl.responseStart);
        }
      }
    } else {
      if (impl.timers.hasOwnProperty("t_page")) {
        rt.endTimer("t_page");
      } else {
        if (impl.t_fb_approx) {
          rt.endTimer("t_resp", impl.t_fb_approx);
          rt.setTimer("t_page", t_done - impl.t_fb_approx, impl.t_fb_approx);
        }
      }
    }
    if (impl.timers.hasOwnProperty("t_postrender")) {
      rt.endTimer("t_postrender");
      rt.endTimer("t_prerender");
    }
    if (impl.navigationStart) {
      t_start = impl.navigationStart;
    } else {
      if (impl.t_start && impl.navigationType !== 2) {
        t_start = impl.t_start;
        BOOMR.addVar("rt.start", "cookie");
      } else {
        BOOMR.addVar("rt.start", "none");
        t_start = undefined;
      }
    }
    if (t_start && impl.sessionStart > t_start) {
      impl.sessionStart = BOOMR.t_lstart || BOOMR.t_start;
      impl.sessionLength = 0;
    }
    BOOMR.debug("Got start time: " + t_start, "rt");
    rt.endTimer("t_done", t_done);
    if (impl.timers.hasOwnProperty("t_server")) {
      rt.endTimer("req_lat", impl.timers["t_server"].start);
      if (impl.ti.responseEnd) {
        var delta = impl.ti.responseEnd - impl.timers["t_server"].end;
        if (delta >= 0) {
          rt.setTimer("resp_lat", delta, impl.timers["t_server"].end);
        } else {
          BOOMR.warn("negative resp_lat: " + impl.timers["t_server"].end + " - " + impl.ti.responseEnd);
        }
      }
    }
    BOOMR.removeVar("req_lat", "resp_lat", "t_server", "t_done", "t_page", "t_resp", "r", "r2", "rt.tstart", "rt.bstart", "rt.end", "rt.ss", "rt.sl", "rt.lt", "t_postrender", "t_prerender", "t_load");
    BOOMR.addVar("rt.tstart", t_start);
    BOOMR.addVar("rt.bstart", BOOMR.t_start);
    BOOMR.addVar("rt.end", impl.timers["t_done"].end);
    impl.getNavTimingOnlyNumbers();
    if (impl.timers["t_configfb"]) {
      if ("t_configfb" in impl.timers && typeof impl.timers["t_configfb"].start !== "number" || isNaN(impl.timers["t_configfb"].start)) {
        if ("t_configjs" in impl.timers && typeof impl.timers["t_configjs"].start === "number") {
          impl.timers["t_configfb"].start = impl.timers["t_configjs"].start;
        } else {
          delete impl.timers["t_configfb"];
        }
      }
    }
    for (t_name in impl.timers) {
      if (impl.timers.hasOwnProperty(t_name)) {
        timer = impl.timers[t_name];
        if (typeof timer.delta !== "number") {
          if (typeof timer.start !== "number") {
            timer.start = t_start;
          }
          timer.delta = timer.end - timer.start;
        }
        if (isNaN(timer.delta)) {
          delete timer.delta;
          continue;
        }
        BOOMR.addVar(t_name, timer.delta);
        ntimers++;
        delete impl.timers[t_name];
      }
    }
    if (ntimers) {
      BOOMR.addVar("r", BOOMR.utils.cleanupURL(impl.r));
      if (impl.r2 !== impl.r) {
        BOOMR.addVar("r2", BOOMR.utils.cleanupURL(impl.r2));
      }
    }
    BOOMR.addVar({"rt.sid":impl.sessionID, "rt.ss":impl.sessionStart, "rt.sl":impl.sessionLength});
    impl.complete = true;
    BOOMR.sendBeacon();
    impl.onloadfired = true;
    return rt;
  }, is_complete:function() {
    return impl.complete;
  }};
}
runrt(window);
function memoryrun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {complete:false, done:function() {
    if (!impl.complete) {
      var w = BOOMR.window, p = w.performance, c = w.console, d = w.document, fn = {}.toString.call(w.opera) === "[object Opera]" ? d.querySelectorAll : d.getElementsByTagName, m, f;
      f = fn.call === undefined ? function(tag) {
        return fn(tag);
      } : fn;
      m = p && p.memory ? p.memory : c && c.memory ? c.memory : null;
      if (p && (p.getEntries && p.getEntries().length)) {
        BOOMR.addVar("dom.res", p.getEntries().length);
      }
      if (m) {
        BOOMR.addVar({"mem.total":m.totalJSHeapSize, "mem.used":m.usedJSHeapSize});
      }
      BOOMR.addVar({"dom.ln":f.call(d, "*").length, "dom.sz":f.call(d, "html")[0].innerHTML.length, "dom.img":f.call(d, "img").length, "dom.script":f.call(d, "script").length});
      impl.complete = true;
      BOOMR.sendBeacon();
    }
  }};
  var memory = BOOMR.plugins.Memory = {init:function() {
    BOOMR.subscribe("page_ready", impl.done, null, impl);
    return memory;
  }, is_complete:function() {
    return impl.complete;
  }};
}
memoryrun();
(function() {
  var connection;
  if (typeof navigator === "object") {
    connection = navigator["connection"] || (navigator["mozConnection"] || (navigator["webkitConnection"] || navigator["msConnection"]));
  }
  if (connection) {
    BOOMR.addVar("mob.ct", connection.type);
    BOOMR.addVar("mob.bw", connection.bandwidth);
    BOOMR.addVar("mob.mt", connection.metered);
  }
})();
function rtrestimingrun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var rtrestiming = "rtrestiming";
  var impl = {complete:false, done:function() {
    if (impl.complete) {
      return;
    }
    var p = BOOMR.window.performance, r, i;
    var data;
    BOOMR.removeVar(rtrestiming);
    if (p && typeof p.getEntriesByType === "function") {
      r = p.getEntriesByType("resource");
      if (r) {
        BOOMR.info("Client supports Resource Timing API", rtrestiming);
        data = {};
        var a = document.createElement("A"), resourceInfo;
        data[rtrestiming] = new Array(r.length);
        for (i = 0;i < r.length;++i) {
          a.href = r[i].name;
          resourceInfo = data[rtrestiming][i] = {"name":a.host == window.location.host ? a.pathname + a.search : r[i].name};
          if (r[i].responseEnd > 0) {
            resourceInfo["rt_total"] = Math.round(r[i].responseEnd - r[i].startTime);
            if (r[i].responseStart) {
              resourceInfo["rt_tansfer"] = Math.round(r[i].responseEnd - r[i].responseStart);
            }
          }
          if (r[i].domainLookupEnd && r[i].domainLookupStart) {
            resourceInfo["rt_dns"] = Math.round(r[i].domainLookupEnd - r[i].domainLookupStart);
          }
          if (r[i].connectEnd && r[i].connectStart) {
            resourceInfo["rt_tcp"] = Math.round(r[i].connectEnd - r[i].connectStart);
          }
          if (r[i].responseStart) {
            resourceInfo["rt_ttfb"] = Math.round(r[i].responseStart - r[i].startTime);
          }
          if (r[i].redirectEnd && r[i].redirectStart) {
            resourceInfo["rt_red"] = Math.round(r[i].redirectEnd - r[i].redirectStart);
          }
        }
        BOOMR.addVar(data);
      }
    }
    impl.complete = true;
    BOOMR.sendBeacon();
  }};
  var rtResourceTiming = BOOMR.plugins.RTResourceTiming = {init:function() {
    BOOMR.subscribe("page_ready", impl.done, null, impl);
    return rtResourceTiming;
  }, is_complete:function() {
    return impl.complete;
  }, varKey:rtrestiming};
}
rtrestimingrun();
function kylierun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {doc:BOOMR.window.document, script:"script", complete:false, pass:false, start_ts:undefined, done:function() {
    if (!impl.complete) {
      impl.complete = true;
      impl.pass = false;
      BOOMR.sendBeacon();
    }
  }, run:function() {
    var k = impl.doc.getElementsByTagName(impl.script)[0], d = impl.doc.createElement(impl.script);
    impl.start_ts = (new Date).getTime();
    d.src = BOOMR.window["BOOMR_cURL"];
    k.parentNode.insertBefore(d, k);
  }};
  var kylie = BOOMR.plugins.Kylie = {init:function() {
    if (impl.complete) {
      return kylie;
    }
    if (impl.pass) {
      setTimeout(impl.done, 10);
      BOOMR.addVar("t_cjs", (new Date).getTime() - impl.start_ts);
      if (perfOptions["BOOMR_configt"]) {
        BOOMR.addVar("t_cfb", perfOptions["BOOMR_configt"] - impl.start_ts);
        delete perfOptions["BOOMR_configt"];
      }
      return kylie;
    }
    impl.pass = true;
    BOOMR.subscribe("page_ready", impl.run, null, null);
    return kylie;
  }, is_complete:function() {
    return impl.complete;
  }};
}
kylierun();
BOOMR.t_end = (new Date).getTime();
var PerfLogLevel = {DEBUG:{name:"DEBUG", value:1}, INTERNAL:{name:"INTERNAL", value:2}, PRODUCTION:{name:"PRODUCTION", value:3}, DISABLED:{name:"DISABLED", value:4}};
var PerfConstants = {PAGE_START_MARK:"PageStart", PERF_PAYLOAD_PARAM:"bulkPerf", MARK_NAME:"mark", MEASURE_NAME:"measure", MARK_START_TIME:"st", MARK_LAST_TIME:"lt", PAGE_NAME:"pn", ELAPSED_TIME:"et", REFERENCE_TIME:"rt", Perf_LOAD_DONE:"loadDone"};
PerfConstants.STATS = {NAME:"stat", SERVER_ELAPSED:"internal_serverelapsed", DB_TOTAL_TIME:"internal_serverdbtotaltime", DB_CALLS:"internal_serverdbcalls", DB_FETCHES:"internal_serverdbfetches"};
window["PerfConstants"] = PerfConstants;
window["PerfLogLevel"] = PerfLogLevel;
window.typePerfLogLevel;
window.typejsonMeasure;
function IPerf() {
}
IPerf.prototype.currentLogLevel;
IPerf.prototype.mark;
IPerf.prototype.endMark;
IPerf.prototype.updateMarkName;
IPerf.prototype.measureToJson;
IPerf.prototype.toJson;
IPerf.prototype.setTimer;
IPerf.prototype.setServerTime;
IPerf.prototype.toPostVar;
IPerf.prototype.getMeasures;
IPerf.prototype.getBeaconData;
IPerf.prototype.setBeaconData;
IPerf.prototype.clearBeaconData;
IPerf.prototype.removeStats;
IPerf.prototype.stat;
IPerf.prototype.getStat;
IPerf.prototype.onLoad;
IPerf.prototype.startTransaction;
IPerf.prototype.endTransaction;
IPerf.prototype.updateTransaction;
IPerf.prototype.enabled;
function IPerf_util() {
}
IPerf.prototype.utils;
IPerf_util.prototype.setCookie;
var perfOptions = window["perfOptions"];
if (!perfOptions) {
  perfOptions = {};
}
BOOMR.init({wait:true, Kylie:{enabled:false}, ResourceTiming:{enabled:!!perfOptions["restiming"]}, autorun:false, beacon_url:perfOptions["bURL"]});
if (perfOptions["pageStartTime"]) {
  BOOMR.plugins.RT.startTimer("t_page", perfOptions["pageStartTime"]);
}
var _beaconData = null;
function getLogLevel(logLevel) {
  if (typeof logLevel === "string") {
    logLevel = PerfLogLevel[logLevel];
  }
  return logLevel || PerfLogLevel.INTERNAL;
}
function updateTimerName(oldName, newName) {
  BOOMR.plugins.RT.updateTimer(oldName, newName);
  return Perf;
}
var Perf = {currentLogLevel:getLogLevel(perfOptions["logLevel"]), mark:function(id, logLevel) {
  if (Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    BOOMR.plugins.RT.startTimer(id);
  }
  return Perf;
}, endMark:function(id, logLevel) {
  if (Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    BOOMR.plugins.RT.endTimer(id);
  }
  return Perf;
}, updateMarkName:updateTimerName, setTimer:function(timer_name, timer_delta, logLevel) {
  if (Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    if (timer_delta >= 0) {
      BOOMR.plugins.RT.setTimer(timer_name, timer_delta);
    } else {
      BOOMR.plugins.RT.endTimer(timer_name);
    }
  }
  return Perf;
}, setServerTime:function(startTime, delta) {
  BOOMR.plugins.RT.setServerTime(startTime, delta);
  return Perf;
}, measureToJson:function(measure) {
  if (window["JSON"]) {
    return JSON.stringify(measure);
  }
  return "{" + PerfConstants.MEASURE_NAME + ':"' + measure[PerfConstants.MEASURE_NAME] + '",' + PerfConstants.MARK_NAME + ':"' + measure[PerfConstants.MARK_NAME] + '",' + PerfConstants.ELAPSED_TIME + ":" + measure[PerfConstants.ELAPSED_TIME] + "," + PerfConstants.REFERENCE_TIME + ":" + measure[PerfConstants.REFERENCE_TIME] + "}";
}, toJson:function(includeMarks) {
  BOOMR.plugins.RT.updateVars();
  var timers = BOOMR.plugins.RT.getTimers(), rt = BOOMR.plugins.RT.getSessionStart(), json = ["{", 'sessionID:"', BOOMR.plugins.RT.getSessionID(), '",', "st:", rt, ",", 'pn:"', window.document.URL, '",', 'uid:"', Math.round(Math.random() * 1E15).toString(), '",'], markJson = [], measureJson = [], k, measure, vars = BOOMR.getVars(), timer;
  for (k in vars) {
    if (k != "r" && (k != "r2" && k != "t_other")) {
      if (vars.hasOwnProperty(k) && !isNaN(vars[k])) {
        if (includeMarks) {
          markJson.push('"' + k + '":' + vars[k]);
        }
        measure = {};
        measure[PerfConstants.MEASURE_NAME] = measure[PerfConstants.MARK_NAME] = k;
        measure[PerfConstants.ELAPSED_TIME] = vars[k];
        timer = timers[k];
        measure[PerfConstants.REFERENCE_TIME] = timer && timer.start ? timer.start : rt;
        measureJson.push(Perf.measureToJson(measure));
      }
    }
  }
  if (includeMarks) {
    json.push("marks:{", markJson.join(","), "},");
  }
  if (vars.hasOwnProperty(BOOMR.plugins.RTResourceTiming.varKey) && window["JSON"]) {
    json.push("restiming:{", JSON.stringify(vars[BOOMR.plugins.RTResourceTiming.varKey]), "},");
  }
  json.push("measures:[", measureJson.join(","), "]}");
  return json.join("");
}, toPostVar:function() {
  return PerfConstants.PERF_PAYLOAD_PARAM + "=" + Perf.toJson().replace(/&/g, "__^__");
}, getMeasures:function() {
  BOOMR.plugins.RT.updateVars();
  var timers = BOOMR.plugins.RT.getTimers(), rt = BOOMR.plugins.RT.getSessionStart(), measures = [], vars = BOOMR.getVars(), k, measure;
  for (k in vars) {
    if (k != "r" && (k != "r2" && k != "t_other")) {
      if (vars.hasOwnProperty(k) && !isNaN(vars[k])) {
        measure = {};
        measure[PerfConstants.MEASURE_NAME] = k;
        measure[PerfConstants.MARK_NAME] = k;
        measure[PerfConstants.ELAPSED_TIME] = vars[k];
        measure[PerfConstants.REFERENCE_TIME] = timers[k] ? timers[k].start : rt;
        measures.push(measure);
      }
    }
  }
  return measures;
}, getBeaconData:function() {
  return _beaconData;
}, setBeaconData:function(beaconData) {
  _beaconData = beaconData;
}, clearBeaconData:function() {
  _beaconData = null;
}, removeStats:BOOMR.removeStats, subscribe:BOOMR.subscribe, stat:function(label, elapsedMillis) {
  BOOMR.addVar("st_" + label, elapsedMillis);
  return Perf;
}, getStat:function(label) {
  BOOMR.plugins.RT.updateVars();
  if (!label) {
    return-1;
  }
  return BOOMR.getVar(label);
}, onLoad:BOOMR.page_ready, startTransaction:function(tName) {
  BOOMR.plugins.RT.startTransaction(tName);
  return Perf;
}, endTransaction:function(tName) {
  BOOMR.plugins.RT.endTransaction(tName);
  return Perf;
}, updateTransaction:updateTimerName, isOnLoadFired:BOOMR.plugins.RT.isOnLoadFired, util:({setCookie:function(name, value, expires, path) {
  document.cookie = name + "=" + escape(value + "") + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "; path=/");
}}), enabled:true};
var ROOT_NAMESPACE = "Perf";
window[ROOT_NAMESPACE] = Perf;
window["PerfLogLevel"] = PerfLogLevel;
window["PerfConstants"] = PerfConstants;
})(this);
