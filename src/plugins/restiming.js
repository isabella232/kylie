/**
 * \file restiming.js
 * Plugin to collect metrics from the W3C Resource Timing API.
 * For more information about Resource Timing,
 * see: http://www.w3.org/TR/resource-timing/
 *
 * @private
 */
function restimingrun() {

	BOOMR = BOOMR || {};
	BOOMR.plugins = BOOMR.plugins || {};

	/**
     * Various constants.
     *
     * @enum {!string}
     * @private
     */
	var restricted = {
		redirectStart: "rt_red_st",
		redirectEnd: "rt_red_end",
		domainLookupStart: "rt_dns_st",
		domainLookupEnd: "rt_dns_end",
		connectStart: "rt_con_st",
		connectEnd: "rt_con_end",
		secureConnectionStart: "rt_scon_st",
		requestStart: "rt_req_st",
		responseStart: "rt_res_st"
	}

	/**
	 * restiming constant used for the VAR key for the data stored in the boomerang.
	 *
	 * @const
	 * @type {!string}
	 * @private
	 */
	 var restiming = "restiming";

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
			var p = BOOMR.window.performance, r, i, k;
			/** @dict */
			var data;
			BOOMR.removeVar(restiming);
			if (p && typeof p.getEntriesByType === "function") {
				r = p.getEntriesByType("resource");
				if (r) {
					BOOMR.info("Client supports Resource Timing API", restiming);
					data = {};
					data[restiming] = new Array(r.length);

					for (i = 0; i < r.length; ++i) {
						data[restiming][i] = {
							/** @expose */
							"rt_name": r[i].name,
							/** @expose */
							"rt_in_type": r[i].initiatorType,
							/** @expose */
							"rt_st": r[i].startTime,
							/** @expose */
							"rt_dur": r[i].duration,
							/** @expose */
							"rt_fet_st": r[i].fetchStart,
							/** @expose */
							"rt_res_end": r[i].responseEnd
						};
						for (k in restricted) {
							if (restricted.hasOwnProperty(k) && r[i][k] > 0) {
								data[restiming][i][restricted[k]] = r[i][k];
							}
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
	var resourceTiming = BOOMR.plugins.ResourceTiming = /** @lends {resourceTiming} */ {
		/**
         * @return {!IPlugin}
         */
		init: function () {
			BOOMR.subscribe("page_ready", impl.done, null, impl);
			return resourceTiming;
		},

		/**
         * @return {boolean}
         */
		is_complete: function () {
			return impl.complete;
		},

		/**
		 * Kylie implementation
		 * 
		 * @type {!string}
		 * @const
		 */
		varKey: restiming
	};

}
restimingrun();