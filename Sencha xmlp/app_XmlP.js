Ext.require([
    'Ext.form.*',
    'Ext.data.*'
]);

Ext.onReady(function(){
	
	//-----------------------------------------------------------------

	Ext.form.action.Load.prototype.run= function() {
        Ext.data.XmlP.request(Ext.apply(
            this.createCallback(),
            {
                method: this.getMethod(),
                url: this.getUrl(),
                headers: this.headers,
                params: this.getParams()
            }
        ));
    };
    
    Ext.form.action.Submit.prototype.doSubmit= function() {
        var formEl,
            ajaxOptions = Ext.apply(this.createCallback(), {
                url: this.getUrl(),
                method: this.getMethod(),
                headers: this.headers
            });

        // For uploads we need to create an actual form that contains the file upload fields,
        // and pass that to the ajax call so it can do its iframe-based submit method.
        if (this.form.hasUpload()) {
            formEl = ajaxOptions.form = this.buildForm();
            ajaxOptions.isUpload = true;
        } else {
            ajaxOptions.params = this.getParams();
        }

        Ext.data.XmlP.request(ajaxOptions);

        if (formEl) {
            Ext.removeNode(formEl);
        }
    };
	
	//-----------------------------------------------------------------
	
    Ext.define('example.contact', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'first', mapping: 'name > first'},
            {name: 'last', mapping: 'name > last'},
            'company', 'email', 'state',
            {name: 'dob', type: 'date', dateFormat: 'm/d/Y'}
        ]
    });

    Ext.define('example.fielderror', {
        extend: 'Ext.data.Model',
        fields: ['id', 'msg']
    });

    var formPanel = Ext.create('Ext.form.Panel', {
        renderTo: 'form-ct',
        frame: true,
        title:'XML Form',
        width: 340,
        bodyPadding: 5,
        waitMsgTarget: true,

        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 85,
            msgTarget: 'side'
        },

        // configure how to read the XML data
        reader : Ext.create('Ext.data.reader.Xml', {
            model: 'example.contact',
            record : 'contact',
            successProperty: '@success'
        }),

        // configure how to read the XML errors
        errorReader: Ext.create('Ext.data.reader.Xml', {
            model: 'example.fielderror',
            record : 'field',
            successProperty: '@success'
        }),

        items: [{
            xtype: 'fieldset',
            title: 'Contact Information',
            defaultType: 'textfield',
            defaults: {
                width: 280
            },
            items: [{
                    fieldLabel: 'First Name',
                    emptyText: 'First Name',
                    name: 'first'
                }, {
                    fieldLabel: 'Last Name',
                    emptyText: 'Last Name',
                    name: 'last'
                }, {
                    fieldLabel: 'Company',
                    name: 'company'
                }, {
                    fieldLabel: 'Email',
                    name: 'email',
                    vtype:'email'
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'State',
                    name: 'state',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['abbr', 'state'],
                        data : Ext.example.states // from states.js
                    }),
                    valueField: 'abbr',
                    displayField: 'state',
                    typeAhead: true,
                    queryMode: 'local',
                    emptyText: 'Select a state...'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Date of Birth',
                    name: 'dob',
                    allowBlank: false,
                    maxValue: new Date()
                }
            ]
        }],

        buttons: [{
            text: 'Load',
            handler: function(){
            	var theForm = formPanel.getForm();
                theForm.load({
                    url: 'xml-form-data.xml',
                    method : 'get',
                    waitMsg: 'Loading...'
                });
            }
        }, {
            text: 'Submit',
            disabled: true,
            formBind: true,
            handler: function(){
                this.up('form').getForm().submit({
                    url: 'xml-form-errors.xml',
                    submitEmptyText: false,
                    waitMsg: 'Saving Data...'
                });
            }
        }]
    });

});
