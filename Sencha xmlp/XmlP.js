/**
 * @class Ext.data.XmlP
 * @singleton
 * This class is used to create XmlP requests. XmlP is a mechanism that allows for making
 * requests for XML data cross domain.
 */
Ext.define('Ext.data.XmlP', {

    /* Begin Definitions */

    singleton: true,

    statics: {
        requestCount: 0,
        requests: {}
    },

    /* End Definitions */

    /**
     * @property timeout
     * @type Number
     * A default timeout for any XmlP requests. If the request has not completed in this time the
     * failure callback will be fired. The timeout is in ms. Defaults to <tt>30000</tt>.
     */
    timeout: 30000,
    recall:1000,

    /**
     * @property disableCaching
     * @type Boolean
     * True to add a unique cache-buster param to requests. Defaults to <tt>true</tt>.
     */
    disableCaching: true,

    /**
     * @property disableCachingParam
     * @type String
     * Change the parameter which is sent went disabling caching through a cache buster. Defaults to <tt>'_dc'</tt>.
     */
    disableCachingParam: '_dc',

    /**
     * @property callbackKey
     * @type String
     * Specifies the GET parameter that will be sent to the server containing the function name to be executed when
     * the request completes. Defaults to <tt>callback</tt>. Thus, a common request will be in the form of
     * url?callback=Ext.data.XmlP.callback1
     */
    callbackKey: 'callback',

    /**
     * Makes a XmlP request.
     * @param {Object} options An object which may contain the following properties. Note that options will
     * take priority over any defaults that are specified in the class.
     * <ul>
     * <li><b>url</b> : String <div class="sub-desc">The URL to request.</div></li>
     * <li><b>params</b> : Object (Optional)<div class="sub-desc">An object containing a series of
     * key value pairs that will be sent along with the request.</div></li>
     * <li><b>timeout</b> : Number (Optional) <div class="sub-desc">See {@link #timeout}</div></li>
     * <li><b>callbackKey</b> : String (Optional) <div class="sub-desc">See {@link #callbackKey}</div></li>
     * <li><b>callbackName</b> : String (Optional) <div class="sub-desc">The function name to use for this request.
     * By default this name will be auto-generated: Ext.data.XmlP.callback1, Ext.data.XmlP.callback2, etc.
     * Setting this option to "my_name" will force the function name to be Ext.data.XmlP.my_name.
     * Use this if you want deterministic behavior, but be careful - the callbackName should be different
     * in each XmlP request that you make.</div></li>
     * <li><b>disableCaching</b> : Boolean (Optional) <div class="sub-desc">See {@link #disableCaching}</div></li>
     * <li><b>disableCachingParam</b> : String (Optional) <div class="sub-desc">See {@link #disableCachingParam}</div></li>
     * <li><b>success</b> : Function (Optional) <div class="sub-desc">A function to execute if the request succeeds.</div></li>
     * <li><b>failure</b> : Function (Optional) <div class="sub-desc">A function to execute if the request fails.</div></li>
     * <li><b>callback</b> : Function (Optional) <div class="sub-desc">A function to execute when the request
     * completes, whether it is a success or failure.</div></li>
     * <li><b>scope</b> : Object (Optional)<div class="sub-desc">The scope in
     * which to execute the callbacks: The "this" object for the callback function. Defaults to the browser window.</div></li>
     * </ul>
     * @return {Object} request An object containing the request details.
     */
    request: function(options){
        options = Ext.apply({}, options);

        //<debug>
        if (!options.url) {
            Ext.Error.raise('A url must be specified for a XmlP request.');
        }
        //</debug>

        var me = this,
            disableCaching = Ext.isDefined(options.disableCaching) ? options.disableCaching : me.disableCaching,
            cacheParam = options.disableCachingParam || me.disableCachingParam,
            //id = ++me.statics().requestCount,
            //callbackName = options.callbackName || 'callback' + id,
            //callbackKey = options.callbackKey || me.callbackKey,
            timeout = Ext.isDefined(options.timeout) ? options.timeout : me.timeout,
            params = Ext.apply({}, options.params),
            url = options.url,
            name = Ext.isSandboxed ? Ext.getUniqueGlobalNamespace() : 'Ext',
            request,
            script;

        //params[callbackKey] = name + '.data.XmlP.' + callbackName;
        if (disableCaching) {
            params[cacheParam] = new Date().getTime();
        }

        script = me.createScript(url, params);

        me.statics().requests[id] = request = {
            url: url,
            params: params,
            script: script,
            id: id,
            scope: options.scope,
            success: options.success,
            failure: options.failure,
            callback: options.callback
            //,callbackName: callbackName
        };

        if (timeout > 0) {
            request.timeout = setTimeout(Ext.bind(me.handleTimeout, me, [request]),timeout);
        }

        me.setupErrorHandling(request);
        //me[callbackName] = Ext.bind(me.handleResponse, me, [request], true);
        Ext.getBody().appendChild(script);
                
        var result = {};
        setTimeout(Ext.bind(me.handleResponse,me,[result, request]),me.recall);
        
        return request;
    },

    /**
     * Abort a request. If the request parameter is not specified all open requests will
     * be aborted.
     * @param {Object/String} request (Optional) The request to abort
     */
    abort: function(request){
        var requests = this.statics().requests,
            key;

        if (request) {
            if (!request.id) {
                request = requests[request];
            }
            this.abort(request);
        } else {
            for (key in requests) {
                if (requests.hasOwnProperty(key)) {
                    this.abort(requests[key]);
                }
            }
        }
    },

    /**
     * Sets up error handling for the script
     * @private
     * @param {Object} request The request
     */
    setupErrorHandling: function(request){
        request.script.onerror = Ext.bind(this.handleError, this, [request]);
    },

    /**
     * Handles any aborts when loading the script
     * @private
     * @param {Object} request The request
     */
    handleAbort: function(request){
        request.errorType = 'abort';
        this.handleResponse(null, request);
    },

    /**
     * Handles any script errors when loading the script
     * @private
     * @param {Object} request The request
     */
    handleError: function(request){
        request.errorType = 'error';
        this.handleResponse(null, request);
    },

    /**
     * Cleans up anu script handling errors
     * @private
     * @param {Object} request The request
     */
    cleanupErrorHandling: function(request){
        request.script.onerror = null;
    },

    /**
     * Handle any script timeouts
     * @private
     * @param {Object} request The request
     */
    handleTimeout: function(request){
        request.errorType = 'timeout';
        this.handleResponse(null, request);
    },

    /**
     * Handle a successful response
     * @private
     * @param {Object} result The result from the request
     * @param {Object} request The request
     */
    handleResponse: function(result, request){
    	var XmlP_src,
    		me=this;
    	
    	if (Ext.isIE){
    		XmlP_src = request.script.contentWindow.document.body.innerText.replace("\n-","\n");
    	}else{
			XmlP_src = request.script.contentDocument;
		}
		
		if (!XmlP_src){
			setTimeout(Ext.bind(me.handleResponse,me,[result, request]),me.recall);
			return;
		}
		
		if (Ext.isIE){
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async=false;
			doc.loadXML(XmlP_src);
			result = {responseText:XmlP_src, responseXML: doc};
		}else {
			var tmp = Ext.clone(XmlP_src);
			result = {responseText:"~",responseXML:tmp};
			//result = Ext.clone(XmlP_src);
		}
				
        var success = true;		
				
		
        if (request.timeout) {
            clearTimeout(request.timeout);
        }
        //delete this[request.callbackName];
        //delete this.statics()[request.id];
        this.cleanupErrorHandling(request);
        
        
        Ext.fly(request.script).remove();
        
		
        if (request.errorType) {
            success = false;
            Ext.callback(request.failure, request.scope, [request.errorType]);
        } else {
            Ext.callback(request.success, request.scope, [result]);
        }
        Ext.callback(request.callback, request.scope, [success, result, request.errorType]);
    },

    /**
     * Create the script tag
     * @private
     * @param {String} url The url of the request
     * @param {Object} params Any extra params to be sent
     */
    createScript: function(url, params) {
        var script = document.createElement('iframe');
        script.setAttribute("id", "XmlP_IFrame");
        script.setAttribute("type", "text/xml");
        script.setAttribute("src", Ext.urlAppend(url, Ext.Object.toQueryString(params)));
        script.setAttribute("async", true);
        script.setAttribute("hidden", "true");
        script.setAttribute("width", "0");
        script.setAttribute("height", "0");
        script.setAttribute("style", "display:none");
        return script;
    }
});

