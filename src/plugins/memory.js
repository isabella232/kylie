/*
 * Copyright (c), Log-Normal, Inc.
 * Copyright (c) 2013, Salesforce.com. All rights reserved.
 */

/**
 * \file memory.js
 * Plugin to collect memory metrics when available.
 * see: http://code.google.com/p/chromium/issues/detail?id=43281
 * 
 * @private
 */
function memoryrun() {

    // First make sure BOOMR is actually defined.  It's possible that your plugin is loaded before boomerang, in which case
    // you'll need this.
    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    /**
     * A private object to encapsulate all your implementation details
     * 
     * @struct
     * @private
     * @const
     */
    var impl = {
        /** type {boolean} */
        complete: false,
        /** type {function()} */
        done: function () {
            if (!impl.complete) {
                var w  = BOOMR.window,
                    p  = w.performance,
                    c  = w.console,
                    d  = w.document,
                    fn = (({}).toString.call(w.opera) === '[object Opera]' ? d.querySelectorAll : d.getElementsByTagName),
                    m,
                    f;

                // handle IE6/7 weirdness regarding host objects
                // See: http://stackoverflow.com/questions/7125288/what-is-document-getelementbyid
                f  = (fn.call === undefined ? /** @suppress {checkTypes} */function (tag) { return fn(tag); } : fn);

                m = (p && p.memory ? p.memory : (c && c.memory ? c.memory : null));

                // If we have resource timing, get number of resources
                if (p && p.getEntries && p.getEntries().length) {
                    BOOMR.addVar("dom.res", p.getEntries().length);
                }

                if (m) {
                    BOOMR.addVar({
                        'mem.total': m.totalJSHeapSize,
                        'mem.used' : m.usedJSHeapSize
                    });
                }

                BOOMR.addVar({
                    'dom.ln': f.call(d, '*').length,
                    'dom.sz': f.call(d, 'html')[0].innerHTML.length,
                    'dom.img': f.call(d, 'img').length,
                    'dom.script': f.call(d, 'script').length
                });

                impl.complete = true;
                BOOMR.sendBeacon();
            }
        }
    };

    /**
     * @struct
     * @const
     * @type {!IPlugin}
     */
    var memory = BOOMR.plugins.Memory =  /** @lends {memory} */ {
        /**
         * @return {!IPlugin}
         */
        init: function () {
            // we do this on onload so that we take a memory and dom snapshot after most things have run
            BOOMR.subscribe("page_ready", impl.done, null, impl);
            return memory;
        },

        /**
         * @return {boolean}
         */
        is_complete: function () {
            return impl.complete;
        }
    };
}
memoryrun();