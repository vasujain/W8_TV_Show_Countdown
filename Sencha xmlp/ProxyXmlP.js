/**
 * @author Jimmy Fines L.Tobing
 *
 * The XmlP proxy is useful when you need to load data from a domain other than the one your application is running on. If
 * your application is running on http://domainA.com it cannot use {@link Ext.data.proxy.Ajax Ajax} to load its data
 * from http://domainB.com because cross-domain ajax requests are prohibited by the browser.
 *
 * The XmlP is based on Default JsonP created by Ed Spencer. just a little modification add for working with XML.
 *
 * 
 */
Ext.define('Ext.data.proxy.XmlP', {
    extend: 'Ext.data.proxy.Server',
    alternateClassName: 'Ext.data.IFrameTagProxy',
    alias: ['proxy.xmlp', 'proxy.iframetag'],
    requires: ['Ext.data.XmlP'],

    defaultWriterType: 'base',

    /**
     * @cfg {String} callbackKey
     * See {@link Ext.data.XmlP#callbackKey}.
     */
    callbackKey : 'callback',

    /**
     * @cfg {String} recordParam
     * The param name to use when passing records to the server (e.g. 'records=someEncodedRecordString'). Defaults to
     * 'records'
     */
    recordParam: 'records',

    /**
     * @cfg {Boolean} autoAppendParams
     * True to automatically append the request's params to the generated url. Defaults to true
     */
    autoAppendParams: true,

    constructor: function(){
        this.addEvents(
            /**
             * @event
             * Fires when the server returns an exception
             * @param {Ext.data.proxy.Proxy} this
             * @param {Ext.data.Request} request The request that was sent
             * @param {Ext.data.Operation} operation The operation that triggered the request
             */
            'exception'
        );
        this.callParent(arguments);
    },

    /**
     * @private
     * Performs the read request to the remote domain. XmlP proxy does not actually create an Ajax request,
     * instead we write out a <iframe> tag based on the configuration of the internal Ext.data.Request object
     * @param {Ext.data.Operation} operation The {@link Ext.data.Operation Operation} object to execute
     * @param {Function} callback A callback function to execute when the Operation has been completed
     * @param {Object} scope The scope to execute the callback in
     */
    doRequest: function(operation, callback, scope) {
        //generate the unique IDs for this request
        var me      = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation),
            params = request.params;

        if (operation.allowWrite()) {
            request = writer.write(request);
        }

        // apply XmlP proxy-specific attributes to the Request
        Ext.apply(request, {
            callbackKey: me.callbackKey,
            timeout: me.timeout,
            scope: me,
            disableCaching: false, // handled by the proxy
            callback: me.createRequestCallback(request, operation, callback, scope)
        });

        // prevent doubling up
        if (me.autoAppendParams) {
            request.params = {};
        }

        request.XmlP = Ext.data.XmlP.request(request);
        // restore on the request
        request.params = params;
        operation.setStarted();
        me.lastRequest = request;

        return request;
    },

    /**
     * @private
     * Creates and returns the function that is called when the request has completed. The returned function
     * should accept a Response object, which contains the response to be read by the configured Reader.
     * The third argument is the callback that should be called after the request has been completed and the Reader has decoded
     * the response. This callback will typically be the callback passed by a store, e.g. in proxy.read(operation, theCallback, scope)
     * theCallback refers to the callback argument received by this function.
     * See {@link #doRequest} for details.
     * @param {Ext.data.Request} request The Request object
     * @param {Ext.data.Operation} operation The Operation being executed
     * @param {Function} callback The callback function to be called when the request completes. This is usually the callback
     * passed to doRequest
     * @param {Object} scope The scope in which to execute the callback function
     * @return {Function} The callback function
     */
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;

        return function(success, response, errorType) {
            delete me.lastRequest;
            me.processResponse(success, operation, request, response, callback, scope);
        };
    },

    // inherit docs
    setException: function(operation, response) {
        operation.setException(operation.request.XmlP.errorType);
    },


    /**
     * Generates a url based on a given Ext.data.Request object. Adds the params and callback function name to the url
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var me      = this,
            url     = me.callParent(arguments),
            params  = Ext.apply({}, request.params),
            filters = params.filters,
            records,
            filter, i;

        delete params.filters;

        if (me.autoAppendParams) {
            url = Ext.urlAppend(url, Ext.Object.toQueryString(params));
        }

        if (filters && filters.length) {
            for (i = 0; i < filters.length; i++) {
                filter = filters[i];

                if (filter.value) {
                    url = Ext.urlAppend(url, filter.property + "=" + filter.value);
                }
            }
        }

        //if there are any records present, append them to the url also
        records = request.records;

        if (Ext.isArray(records) && records.length > 0) {
            url = Ext.urlAppend(url, Ext.String.format("{0}={1}", me.recordParam, me.encodeRecords(records)));
        }

        return url;
    },

    //inherit docs
    destroy: function() {
        this.abort();
        this.callParent();
    },

    /**
     * Aborts the current server request if one is currently running
     */
    abort: function() {
        var lastRequest = this.lastRequest;
        if (lastRequest) {
            Ext.data.XmlP.abort(lastRequest.XmlP);
        }
    },

    /**
     * Encodes an array of records into a string suitable to be appended to the script src url. This is broken out into
     * its own function so that it can be easily overridden.
     * @param {Ext.data.Model[]} records The records array
     * @return {String} The encoded records string
     */
    encodeRecords: function(records) {
        var encoded = "",
            i = 0,
            len = records.length;

        for (; i < len; i++) {
            encoded += Ext.Object.toQueryString(records[i].data);
        }

        return encoded;
    }
});

