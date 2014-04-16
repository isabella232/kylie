/*
 * Copyright (c) 2011, Yahoo! Inc.  All rights reserved.
 * Copyright (c) 2012, Log-Normal, Inc.  All rights reserved.
 * Copyright (c) 2013, Salesforce.com  All rights reserved.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.
 */

/*jshint sub:true*/

/**
 * This is the Round Trip Time plugin. Abbreviated to RT the parameter is the window
 * 
 * @param {Window} w
 * @private
 */
function runrt(w) {

    /**
     * @type {Document}
     */
    var d = w.document;

    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    /**
     * @struct
     * @private
     */
    var impl = {
        /** @type {!boolean} */
        initialized: false, //! Set when init has completed to prevent double initialization
        /** @type {!boolean} */
        onloadfired : false,
        /** @type {!boolean} */
        visiblefired : false,
        /** @type {!boolean} */
        complete : false, // ! Set when this plugin has completed
        timers : {}, // ! Custom timers that the developer can use
        // Format for each timer is { start: XXX, end: YYY, delta: YYY-XXX }
        /**
         * Name of the cookie that stores the start time and referrer
         * @type {!string}
         */
        cookie : 'RT',
        /**
         * Cookie expiry in seconds
         * @type {!number}
         */
        cookie_exp : 1800,
        /** @type {!boolean} */
        strict_referrer : false, // ! By default, don't beacon if referrers don't match.
        // If set to false, beacon both referrer values and let
        // the back end decide
        /** @type {number} */
        navigationType : 0,
        /** @type {number|undefined} */
        navigationStart : undefined,
        /** @type {number|undefined} */
        responseStart : undefined,
        /**
         * Kylie Implementation
         * Performance.timing API if exists or an object with some of the items.
         * 
         * @type {Object|undefined}
         */
        ti : undefined,
        /**
         * 2**32 -1
         * @type {!string}
         */
        sessionID : Math.floor(Math.random() * 4294967296).toString(36),
        /** @type {number|undefined} */
        sessionStart : undefined,
        /** @type {number} */
        sessionLength : 0,
        /** @type {number|undefined} */
        t_start : undefined,
        /** @type {number|undefined} */
        t_fb_approx: undefined,
        /** @type {?string} */
        r : null,
        /** @type {?string} */
        r2 : null,

        /**
         * @param {?Object.<!string,!string>=} params
         * @param {?string=} timer
         * @private
         */
        updateCookie: function (params, timer) {
            var t_end, t_start, subcookies, k;

            // Disable use of RT cookie by setting its name to a falsy value
            if (!impl.cookie) {
                return impl;
            }

            subcookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie)) || {};

            if (typeof params === "object") {
                for (k in params) {
                    if (params.hasOwnProperty(k)) {
                        if (params[k] === undefined ) {
                            if (subcookies.hasOwnProperty(k)) {
                                delete subcookies[k];
                            }
                        } else {
                            if ((k === "nu") || (k === "r")) {
                                params[k] = BOOMR.utils.hashQueryString(params[k], true);
                            }

                            subcookies[k] = params[k];
                        }
                    }
                }
            }

            t_start = new Date().getTime();

            if (timer) {
                subcookies[timer] = t_start;
            }

            BOOMR.debug("Setting cookie (timer=" + timer + ")\n" + BOOMR.utils.objectToString(subcookies), "rt");
            if (!BOOMR.utils.setCookie(impl.cookie, subcookies, impl.cookie_exp)) {
                BOOMR.error("cannot set start cookie", "rt");
                return impl;
            }

            t_end = new Date().getTime();
            if (t_end - t_start > 50) {
                // It took > 50ms to set the cookie
                // The user Most likely has cookie prompting turned on so
                // t_start won't be the actual unload time
                // We bail at this point since we can't reliably tell t_done
                BOOMR.utils.removeCookie(impl.cookie);

                // at some point we may want to log this info on the server side
                BOOMR.error("took more than 50ms to set cookie... aborting: " + t_start + " -> " + t_end, "rt");
            }

            return impl;
        },

        /** @suppress {checkTypes} */
        initFromCookie: function () {
            var url,
                subcookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie));

            if (!subcookies) {
                return;
            }

            subcookies["s"] = Math.max(+subcookies["ul"] || 0, +subcookies["cl"] || 0);

            BOOMR.debug("Read from cookie " + BOOMR.utils.objectToString(subcookies), "rt");
            // If we have a start time, and either a referrer, or a clicked on URL,
            // we check if the start time is usable
            if (subcookies["s"] && (subcookies["r"] || subcookies["nu"])) {
                impl.r = subcookies["r"];
                url = BOOMR.utils.hashQueryString(d.URL, true);

                // Either the URL of the page setting the cookie needs to match document.referrer
                BOOMR.debug(impl.r + " =?= " + impl.r2, "rt");

                // Or the start timer was no more than 15ms after a click or form submit
                // and the URL clicked or submitted to matches the current page's URL
                // (note the start timer may be later than click if both click and beforeunload fired
                // on the previous page)
                BOOMR.debug(subcookies["s"] + " <? " + (+subcookies["cl"] + 15), "rt");
                BOOMR.debug(subcookies["nu"] + " =?= " + url, "rt");

                if (!impl.strict_referrer || (subcookies["nu"] && (subcookies["nu"] === url) && (subcookies["s"] < +subcookies["cl"] + 15)) || ((subcookies["s"] === +subcookies["ul"]) && (impl.r === impl.r2))) {
                    impl.t_start = subcookies["s"];
                    // additionally, if we have a pagehide, or unload event, that's a proxy
                    // for the first byte of the current page, so use that wisely
                    if (+subcookies["hd"] > subcookies["s"]) {
                        impl.t_fb_approx = parseInt(subcookies["hd"], 10);
                    }
                } else {
                    impl.t_start = impl.t_fb_approx = undefined;
                }
            }

            // Now that we've pulled out the timers, we'll clear them so they don't pollute future calls
            impl.updateCookie({
                "s":  undefined,  // start timer
                "r":  undefined,  // referrer
                "nu": undefined,  // clicked url
                "ul": undefined,  // onbeforeunload time
                "cl": undefined,  // onclick time
                "hd": undefined   // onunload or onpagehide time
            });
        },

        /** @private */
        getBoomerangTimings: function () {
            if (BOOMR.t_start) {
                // How long does it take Boomerang to load up and execute (fb to lb)?
                BOOMR.plugins.RT.startTimer('boomerang', BOOMR.t_start);
                BOOMR.plugins.RT.endTimer('boomerang', BOOMR.t_end);    // t_end === null defaults to current time

                // How long did it take from page request to boomerang fb?
                BOOMR.plugins.RT.endTimer('boomr_fb', BOOMR.t_start);

                if (BOOMR.t_lstart) {
                    // when did the boomerang loader start loading boomerang on the page?
                    BOOMR.plugins.RT.endTimer('boomr_ld', BOOMR.t_lstart);
                    // What was the network latency for boomerang (request to first byte)?
                    BOOMR.plugins.RT.setTimer('boomr_lat', BOOMR.t_start - BOOMR.t_lstart, BOOMR.t_lstart);
                }
            }
            // use window and not w because we want the inner iframe
            if (window.performance && window.performance.getEntriesByName) {
                var res, k,
                    urls = { "rt.bmr." : BOOMR.url },
                    url;

                for (url in urls) {
                    if (urls.hasOwnProperty(url) && urls[url]) {
                        res = window.performance.getEntriesByName(urls[url]);
                        if (!res || (res.length === 0)) {
                            continue;
                        }
                        res = res[0];

                        for (k in res) {
                            if (res.hasOwnProperty(k) && (k.match(/(Start|End)$/) && res[k] > 0)) {
                                BOOMR.addVar(url + k.replace(/^(...).*(St|En).*$/, '$1$2'), res[k]);
                            }
                        }
                    }
                }
            }
        },

        /**
         * @return {boolean}
         * @private
         */
        checkPreRender: function () {
            if (!(d["webkitVisibilityState"] && d["webkitVisibilityState"] === "prerender") && !(d["msVisibilityState"] && d["msVisibilityState"] === 3)) {
                return false;
            }

            // This means that onload fired through a pre-render.  We'll capture this
            // time, but wait for t_done until after the page has become either visible
            // or hidden (ie, it moved out of the pre-render state)
            // http://code.google.com/chrome/whitepapers/pagevisibility.html
            // http://www.w3.org/TR/2011/WD-page-visibility-20110602/
            // http://code.google.com/chrome/whitepapers/prerender.html

            BOOMR.plugins.RT.startTimer("t_load", impl.navigationStart);
            BOOMR.plugins.RT.endTimer("t_load");                    // this will measure actual onload time for a prerendered page
            BOOMR.plugins.RT.startTimer("t_prerender", impl.navigationStart);
            BOOMR.plugins.RT.startTimer("t_postrender");                // time from prerender to visible or hidden

            BOOMR.subscribe("visibility_changed", BOOMR.plugins.RT.done, "visible", BOOMR.plugins.RT);

            return true;
        },

        /** @private */
        initNavTiming: function () {
            var p, source;

            if (impl.navigationStart) {
                return;
            }

            // Get start time from WebTiming API see:
            // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html
            // http://blogs.msdn.com/b/ie/archive/2010/06/28/measuring-web-page-performance.aspx
            // http://blog.chromium.org/2010/07/do-you-know-how-slow-your-web-page-is.html
            p = w.performance || w["msPerformance"] || w["webkitPerformance"] || w["mozPerformance"];

            if (p && p.navigation) {
                impl.navigationType = p.navigation.type;
            }

            if (p && p.timing) {
                impl.ti = p.timing;
            } else if (w.chrome && w.chrome.csi && w.chrome.csi().startE) {
                // Older versions of chrome also have a timing API that's sort of documented here:
                // http://ecmanaut.blogspot.com/2010/06/google-bom-feature-ms-since-pageload.html
                // source here:
                // http://src.chromium.org/viewvc/chrome/trunk/src/chrome/renderer/loadtimes_extension_bindings.cc?view=markup
                impl.ti = {
                    navigationStart: w.chrome.csi().startE
                };
                source = "csi";
            } else if (w.gtbExternal && w.gtbExternal.startE()) {
                // The Google Toolbar exposes navigation start time similar to old versions of chrome
                // This would work for any browser that has the google toolbar installed
                impl.ti = {
                    navigationStart: w.gtbExternal.startE()
                };
                source = 'gtb';
            }

            if (impl.ti) {
                // Always use navigationStart since it falls back to fetchStart (not with redirects)
                // If not set, we leave t_start alone so that timers that depend
                // on it don't get sent back.  Never use requestStart since if
                // the first request fails and the browser retries, it will contain
                // the value for the new request.
                BOOMR.addVar("rt.start", source || "navigation");
                impl.navigationStart = impl.ti.navigationStart || impl.ti.fetchStart || undefined;
                impl.responseStart = impl.ti.responseStart || undefined;

                // bug in Firefox 7 & 8 https://bugzilla.mozilla.org/show_bug.cgi?id=691547
                if (navigator.userAgent.match(/Firefox\/[78]\./)) {
                    impl.navigationStart = impl.ti.unloadEventStart || impl.ti.fetchStart || undefined;
                }
            } else {
                BOOMR.warn("This browser doesn't support the WebTiming API", "rt");
            }

            return;
        },

        /** @param {!Event} edata */
        page_unload: function (edata) {
            BOOMR.debug("Unload called with " + BOOMR.utils.objectToString(edata), "rt");
            // set cookie for next page
            // We use document.URL instead of location.href because of a bug in safari 4
            // where location.href is URL decoded
            impl.updateCookie({ "r" : d.URL }, edata.type === "beforeunload" ? "ul" : "hd");
        },

        /**
         * @param {!string} name
         * @param {!string} element
         * @param {Node} etarget
         * @param {!function(!Node)} value_cb
         * @private
         */
        _iterable_click: function (name, element, etarget, value_cb) {
            if (!etarget) {
                return;
            }
            BOOMR.debug(name + " called with " + etarget.nodeName, "rt");
            while (etarget && (etarget.nodeName.toUpperCase() !== element)) {
                etarget = etarget.parentNode;
            }
            if (etarget && etarget.nodeName.toUpperCase() === element) {
                BOOMR.debug("passing through", "rt");
                // user event, they may be going to another page
                // if this page is being opened in a different tab, then
                // our unload handler won't fire, so we need to set our
                // cookie on click or submit
                impl.updateCookie({ "nu" : value_cb(etarget) }, "cl");
            }
        },

        /**
         * @param {!Node} etarget
         * @private
         */
        onclick: function (etarget) {
            impl._iterable_click("Click", "A", etarget, function (t) { return t.href; });
        },

        /**
         * @param {!Node} etarget
         * @private
         */
        onsubmit: function (etarget) {
            impl._iterable_click("Submit", "FORM", etarget, function(t) { var v = t.action || d.URL; return v.match(/\?/) ? v : v + "?"; });
        },

        /**
         * Kylie implementation
         * This is the time when DOMContentLoaded event is fired
         */
        domloaded : function () {
            BOOMR.plugins.RT.endTimer('t_domloaded');
        },

        /**
         * Kylie implementation
         * This is the time when onLoad event is fired
         */
        onLoad : function () {
            BOOMR.plugins.RT.endTimer('t_onLoad');
        }
    };

    /**
     * @struct
     * @const
     * @type {!IPlugin}
     */
    var rt = BOOMR.plugins.RT = /** @lends {rt} */ {
        /**
         * @param {?Object.<string, *>=} config
         * @return {!IPlugin}
         */
        init : function (config) {

            BOOMR.debug("init RT", "rt");
            if (w !== BOOMR.window) {
                w = BOOMR.window;
                d = w.document;
            }

            BOOMR.utils.pluginConfig(impl, config, "RT", ["cookie", "cookie_exp", "strict_referrer"]);

            // A beacon may be fired automatically on page load or if the page dev fires
            // it manually with their own timers.  It may not always contain a referrer
            // (eg: XHR calls).  We set default values for these cases.
            // This is done before reading from the cookie because the cookie overwrites
            // impl.r
            impl.r = impl.r2 = BOOMR.utils.hashQueryString(d.referrer, true);

            // Now pull out start time information from the cookie
            // We'll do this every time init is called, and every time we call it, it will
            // overwrite values already set (provided there are values to read out)
            impl.initFromCookie();

            // We'll get BoomerangTimings every time init is called because it could also
            // include additional timers which might happen on a subsequent init call.
            impl.getBoomerangTimings();

            // only initialize once.  we still collect config and read from cookie
            // every time init is called, but we set event handlers only once
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

            // Kylie implementation
            // when onLoad is triggered
            BOOMR.subscribe('onLoad', impl.onLoad, null, impl);

            if (!impl.sessionStart) {
                impl.sessionStart = BOOMR.t_lstart || BOOMR.t_start;
            }

            impl.initialized = true;
            return rt;
        },

        /**
         * @param {string} timer_name
         * @param {?number=} time_value
         */
        startTimer: function (timer_name, time_value) {
            if (timer_name) {
                if (timer_name === 't_page') {
                    rt.endTimer('t_resp', time_value);
                }
                impl.timers[timer_name] = {start: ((typeof time_value === "number") ? time_value : new Date().getTime())};
            }

            return rt;
        },

        /**
         * @param {string} timer_name
         * @param {?number=} time_value
         */
        endTimer: function (timer_name, time_value) {
            if (timer_name) {
                impl.timers[timer_name] = impl.timers[timer_name] || {};
                if (impl.timers[timer_name].end === undefined) {
                    impl.timers[timer_name].end =
                        (typeof time_value === "number" ? time_value : new Date().getTime());
                }
            }

            return rt;
        },

        /**
         * Kylie Implementation
         * @param {string} timer_name
         * @param {!number} time_delta
         * @param {!number} time_start
         * @return {!Object} for chaining methods
         */
        setTimer : function (timer_name, time_delta, time_start) {
            if (timer_name) {
                impl.timers[timer_name] = {
                    delta: time_delta,
                    start: time_start
                };
            }
            return rt;
        },

        /**
         * Kylie Implementation
         * @param {string} old_timer
         * @param {string} new_timer
         */
        updateTimer : function (old_timer, new_timer) {
            if (old_timer) {
                impl.timers[new_timer] = impl.timers[old_timer];
                impl.timers[old_timer] = {};
            }
        },

        /**
         * Kylie implementation This is the time when onLoad is fired
         *
         * @return {!Object} for chaining methods
         */
        clearTimers : function () {
            impl.timers = {};
            return rt;
        },

        /**
         * Kylie implementation
         * This method updates vars with any newly created timers
         */
        updateVars : function () {
            if (impl.timers) {
                var timer, t_name;
                for (t_name in impl.timers) {
                    if (impl.timers.hasOwnProperty(t_name)) {
                        timer = impl.timers[t_name];
                        // only if the timer has been ended
                        if (timer.end && timer.start) {
                            if (typeof timer.delta !== 'number') {
                                timer.delta = timer.end - timer.start;
                            }
                            BOOMR.addVar(t_name, timer.delta);
                        }
                    }
                }
            }
        },

        /**
         * Kylie implementation
         * This method returns the set timers
         * 
         * @return {Object.<!​string, {start: (number|​undefined), end: (number|​undefined)}>​}
         */
        getTimers : function () {
            return impl.timers;
        },

        /**
         * Kylie implementation
         * This method is used to mark the start of a transaction
         *
         * @return {!Object} for chaining methods
         */
        startTransaction : function (tName) {
            return BOOMR.plugins.RT.startTimer('txn_' + tName, new Date().getTime());
        },

        /**
         * Kylie implementation
         * This method is used to mark the end of a transaction
         *
         * @return {!Object} for chaining methods
         */
        endTransaction : function (tName) {
            return BOOMR.plugins.RT.endTimer('txn_' + tName, new Date().getTime());
        },

        /**
         * Kylie implementation
         * This method returns the sessionID passed on by the server
         *
         * @return {!string}
         */
        getSessionID : function () {
            return impl.sessionID;
        },

        /**
         * Kylie implementation
         * This method returns the start of the session
         *
         * @return {number|undefined}
         */
        getSessionStart : function () {
            return impl.sessionStart;
        },

        /**
         * Kylie implementation
         * This method returns if onload has been fired or not
         *
         * @return {!boolean}
         */
        isOnLoadFired : function () {
            return impl.onloadfired;
        },

        /**
         * Kylie implementation
         * This method sets the time that the server started processing the request and 
         * finished sending the response.
         *
         * @param {number} startTime time in ms (in browser local time).
         * @param {number} delta The time spent on the server in ms (in browser local time).
         */
        setServerTime : function (startTime, delta) {
            rt.startTimer("t_server", startTime).endTimer("t_server", startTime + delta);
        },

        /**
         * Called when the page has reached a "usable" state. This may be when
         * the onload event fires, or it could be at some other moment during/after
         * page load when the page is usable by the user
         * 
         * @param {!Object} edata
         * @param {!string} ename
         * @return {!Object}
         */
        done : function (edata, ename) {
            BOOMR.debug("Called done with " + BOOMR.utils.objectToString(edata) + ", " + ename, "rt");
            var t_start,
                t_done = new Date().getTime(),
                ntimers = 0,
                t_name,
                timer,
                t_other = [];

            impl.complete = false;

            impl.initFromCookie();
            impl.initNavTiming();

            if (impl.checkPreRender()) {
                return rt;
            }

            if (impl.responseStart) {
                // Use NavTiming API to figure out resp latency and page time
                // t_resp will use the cookie if available or fallback to NavTiming
                rt.endTimer("t_resp", impl.responseStart);
                if (impl.timers['t_load']) {
                    rt.setTimer('t_page', impl.timers['t_load'].end - impl.responseStart, impl.responseStart);
                } else {
                    var delta = t_done - impl.responseStart;

                    //Chrome will sometimes report a negative number.
                    if (delta > 0) {
                        rt.setTimer('t_page', delta, impl.responseStart);
                    }
                }
            } else if (impl.timers.hasOwnProperty('t_page')) {
                // If the dev has already started t_page timer, we can end it now as well
                rt.endTimer('t_page');
            } else if (impl.t_fb_approx) {
                rt.endTimer('t_resp', impl.t_fb_approx);
                rt.setTimer("t_page", t_done - impl.t_fb_approx, impl.t_fb_approx);
            }

            // If a prerender timer was started, we can end it now as well
            if (impl.timers.hasOwnProperty('t_postrender')) {
                rt.endTimer('t_postrender');
                rt.endTimer('t_prerender');
            }


            if (impl.navigationStart) {
                t_start = impl.navigationStart;
            } else if (impl.t_start && impl.navigationType !== 2) {
                t_start = impl.t_start;                // 2 is TYPE_BACK_FORWARD but the constant may not be defined across browsers
                BOOMR.addVar("rt.start", "cookie");    // if the user hit the back button, referrer will match, and cookie will match
            } else {                                   // but will have time of previous page start, so t_done will be wrong
                BOOMR.addVar("rt.start", "none");
                t_start = undefined;            // force all timers to NaN state
            }

            if (t_start && impl.sessionStart > t_start) {
                impl.sessionStart = BOOMR.t_lstart || BOOMR.t_start;
                impl.sessionLength = 0;
            }

            BOOMR.debug("Got start time: " + t_start, "rt");

            // If the dev has already called endTimer, then this call will do nothing
            // else, it will stop the page load timer

            rt.endTimer('t_done', t_done);

            //Kylie implementation
            if(impl.timers.hasOwnProperty("t_server")) {
                rt.endTimer("req_lat", impl.timers["t_server"].start);
                if(impl.ti.responseEnd) {
                    rt.startTimer("resp_lat", impl.timers["t_server"].end).endTimer("resp_lat", impl.ti.responseEnd);
                }
            }
            // make sure old variables don't stick around
            BOOMR.removeVar('t_done', 't_page', 't_resp', 'r', 'r2', 'rt.tstart', 'rt.bstart', 'rt.end', 'rt.ss', 'rt.sl', 'rt.lt', 't_postrender', 't_prerender', 't_load');

            BOOMR.addVar('rt.tstart', t_start);
            BOOMR.addVar('rt.bstart', BOOMR.t_start);
            BOOMR.addVar('rt.end', impl.timers['t_done'].end); // don't just use t_done because dev may have called endTimer before we did

            /* Config plugin support */
            if (impl.timers['t_configfb']) {
                if (('t_configfb' in impl.timers && typeof impl.timers['t_configfb'].start !== 'number') || isNaN(impl.timers['t_configfb'].start)) {
                    if ('t_configjs' in impl.timers && typeof impl.timers['t_configjs'].start === 'number') {
                        impl.timers['t_configfb'].start = impl.timers['t_configjs'].start;
                    } else {
                        delete impl.timers['t_configfb'];
                    }
                }
            }

            for (t_name in impl.timers) {
                if (impl.timers.hasOwnProperty(t_name)) {
                    timer = impl.timers[t_name];

                    // if delta is a number, then it was set using setTimer
                    // if not, then we have to calculate it using start & end
                    if (typeof timer.delta !== "number") {
                        if (typeof timer.start !== "number") {
                            timer.start = t_start;
                        }
                        timer.delta = timer.end - timer.start;
                    }

                    // If the caller did not set a start time, and if there was no start cookie
                    // Or if there was no end time for this timer,
                    // then timer.delta will be NaN, in which case we discard it.
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

                if (t_other.length) {
                    BOOMR.addVar("t_other", t_other.join(','));
                }
            }

            BOOMR.addVar({
                'rt.sid' : impl.sessionID,
                'rt.ss' : impl.sessionStart,
                'rt.sl' : impl.sessionLength
            });

            impl.complete = true;

            BOOMR.sendBeacon(); // we call sendBeacon() anyway because some
                                // other plugin may have blocked waiting 
                                // for RT to complete
            impl.onloadfired = true;
            return rt;
        },

        /**
         * @return {boolean}
         */
        is_complete : function () {
            return impl.complete;
        }
    };
}
runrt(window); // end of RT plugin