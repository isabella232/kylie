/**
 * \file rtrestiming.js
 * Plugin to collect metrics from the Round Trip Time 
 * from the W3C Resource Timing API.
 * For more information about Resource Timing,
 * see: http://www.w3.org/TR/resource-timing/
 *
 * @private
 */
function rtrestimingrun() {

    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    /**
     * restiming constant used for the VAR key for the data stored in the boomerang.
     *
     * @const
     * @type {!string}
     * @private
     */
    var rtrestiming = "rtrestiming";

    /**
     * A private object to encapsulate all your implementation details
     * 
     * @struct
     * @private
     * @const
     */
    var impl = {
        /** @type {boolean} */
        complete: false,
        /** type {function()} */
        done: function () {
            if (impl.complete) {
                return;
            }
            var p = BOOMR.window.performance, r, i;
            /** @dict */
            var data;
            BOOMR.removeVar(rtrestiming);
            if (p && typeof p.getEntriesByType === "function") {
                r = p.getEntriesByType("resource");
                if (r) {
                    BOOMR.info("Client supports Resource Timing API", rtrestiming);
                    data = {};

                    var a = document.createElement("A"),
                        resourceInfo;
                    data[rtrestiming] = new Array(r.length);

                    for (i = 0; i < r.length; ++i) {
                        a.href = r[i].name;
                        resourceInfo = data[rtrestiming][i] = {
                        	/** @expose */
                        	"name": (a.host == window.location.host) ? (a.pathname + a.search) : r[i].name
                        };
                        // Fix for chrome issue: https://code.google.com/p/chromium/issues/detail?id=346960
                        if(r[i].responseEnd > 0) {
                        	resourceInfo["rt_total"] = Math.round(r[i].responseEnd - r[i].startTime);
                        	if(r[i].responseStart) {
                        		resourceInfo["rt_tansfer"] = Math.round(r[i].responseEnd - r[i].responseStart);
                        	}
                        }
                        if(r[i].domainLookupEnd && r[i].domainLookupStart) {
                        	resourceInfo["rt_dns"] = Math.round(r[i].domainLookupEnd - r[i].domainLookupStart);
                        }
                        if(r[i].connectEnd && r[i].connectStart) {
                        	resourceInfo["rt_tcp"] = Math.round(r[i].connectEnd - r[i].connectStart);
                        }
                        if(r[i].responseStart) {
                        	resourceInfo["rt_ttfb"] = Math.round(r[i].responseStart - r[i].startTime);
                        }
                        if(r[i].redirectEnd && r[i].redirectStart) {
                        	resourceInfo["rt_red"] = Math.round(r[i].redirectEnd - r[i].redirectStart);
                        }
                    }
                    BOOMR.addVar(data);
                }
            }
            impl.complete = true;
            BOOMR.sendBeacon();
        }
    };

    /**
     * @struct
     * @const
     * @type {!IPlugin}
     */
    var rtResourceTiming = BOOMR.plugins.RTResourceTiming = /** @lends {rtResourceTiming} */ {
        /**
         * @return {!IPlugin}
         */
        init: function () {
            BOOMR.subscribe("page_ready", impl.done, null, impl);
            return rtResourceTiming;
        },

        /**
         * @return {boolean}
         */
        is_complete: function () {
            return impl.complete;
        },

        /**
         * @type {!string}
         * @const
         */
        varKey: rtrestiming
    };

}
rtrestimingrun();