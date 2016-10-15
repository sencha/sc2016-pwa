/**
 * This view is used to wrap multiple calendar views and allows
 * switching between and communicating with them through a
 * single interface. This class does not provide any additional UI
 * functionality, that is provided by {@link Ext.calendar.panel.Panel} which
 * wraps this component.
 */
Ext.define('Ext.calendar.view.Multi', {
    extend: 'Ext.container.Container',
    xtype: 'calendar-multiview',

    requires: [
        'Ext.calendar.date.Util'
    ],

    layout: 'fit',

    platformConfig: {
        '!desktop':  {
            compact: true
        }
    },

    config: {
        /**
         * @cfg {Boolean} compact
         * `true` to display in compact mode, typically used
         * for smaller form factors.
         */
        compact: false,

        /**
         * @cfg {Object} [compactOptions]
         * A series of config options for this class to set when this class is in
         * {@link #compact} mode.
         */
        compactOptions: null,

        /**
         * @cfg {Object/Ext.calendar.store.Calendars} store
         * A calendar store instance or configuration.
         */
        store: null,

        /**
         * @cfg {Number} timezoneOffset
         * The timezone offset to display this calendar in. The value should be
         * specified in the same way as the native Date offset. That is, the number
         * of minutes between UTC and local time. For example the offset for UTC+10
         * would be -600 (10 hours * 60 minutes ahead).
         *
         * Defaults to the current browser offset.
         */
        timezoneOffset: undefined,

        /**
         * @cfg {Date} value
         * The value that controls the underlying {@link #views}.
         */
        value: undefined,

        /**
         * @cfg {Object} views
         * The calendar views to have available, each item in
         * this configuration (labelled by a key) is to contain
         * the configuration for the view, a class that extends
         * {@link Ext.calendar.panel.Base}.
         */
        views: null
    },

    defaultView: null,

    constructor: function(config) {
        this.callParent([config]);
        var view = this.defaultView;
        if (view) {
            this.setView(view);
        }
    },

    /**
     * Moves the active view forward. The amount moved
     * depends on the current view.
     */
    moveNext: function() {
        this.setValue(this.activeView.calculateMoveNext());
    },

    /**
     * Moves the active view backward. The amount moved
     * depends on the current view.
     */
    movePrevious: function() {
        this.setValue(this.activeView.calculateMovePrevious());
    },

    /**
     * Move the current view by an amount based of the current {@link #value}.
     * @param {Number} amount The number of intervals to move.
     * @param {String} [interval=Ext.Date.DAY] The interval to navigate by. See {@link Ext.Date}
     * for valid intervals.
     */
    navigate: function(amount, interval) {
        var D = Ext.Date;
        if (amount !== 0) {
            this.setValue(D.add(this.getValue(), interval || D.DAY, amount));
        }
    },

    setView: function(view) {
        var me = this,
            active = me.activeView,
            cfg;

        if (active && active.$key === view) {
            return;
        }

        Ext.suspendLayouts();
        if (active) {
            me.remove(active);
        }
        cfg = me.getViews()[view];
        //<debug>
        if (!cfg) {
            Ext.raise('Invalid view specified: "' + view + '".');
        }
        //</debug>
        me.activeView = me.add(me.createView(cfg, view));
        me.recalculate(me.getValue());

        Ext.resumeLayouts(true);
    },

    // Appliers/Updaters
    updateCompact: function(compact) {
        this.setViewCfg('setCompact', compact);
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.StoreManager.lookup(store, 'calendar-calendars');
        }
        return store;
    },

    updateStore: function(store) {
        var me = this;

        me.setViewCfg('setStore', store);
        if (!me.isConfiguring) {
            me.recalculate(me.getValue());
        }
    },

    applyTimezoneOffset: function(timezoneOffset) {
        this.autoOffset = false;
        if (timezoneOffset === undefined) {
            timezoneOffset = Ext.calendar.date.Util.getDefaultTimezoneOffset();
            this.autoOffset = true;
        }
        return timezoneOffset;
    },

    updateTimezoneOffset: function(timezoneOffset) {
        this.setViewCfg('setTimezoneOffset', timezoneOffset);
    },

    applyValue: function(value, oldValue) {
        value = Ext.Date.clearTime(value || Ext.calendar.date.Util.getLocalNow(), true);
        if (oldValue && oldValue.getTime() === value.getTime()) {
            value = undefined;
        }
        return value;
    },

    updateValue: function(value) {
        if (!this.isConfiguring) {
            this.recalculate(value);
        }
    },
    
    showAddForm: function(data, options) {
        return this.activeView.showAddForm(data, options);
    },
    
    showEditForm: function(event, options) {
        return this.activeView.showEditForm(event, options);
    },

    privates: {
        createView: function(cfg, key) {
            var me = this;

            return Ext.apply({
                $key: key,
                controlStoreRange: false,
                compact: me.getCompact(),
                store: me.getStore(),
                timezoneOffset: me.autoOffset ? undefined : me.getTimezoneOffset(),
                value: me.getValue(),
                listeners: {
                    scope: me,
                    valuechange: 'onValueChange'
                }
            }, cfg);
        },

        getActiveKey: function() {
            var active = this.activeView;
            return active ? active.$key : '';
        },
        
        onValueChange: function(view, context) {
            this.setValue(context.value);
            this.fireEvent('valuechange', this, context);
        },

        recalculate: function(value) {
            var view = this.activeView,
                store = this.getStore(),
                range, eventSource;

            if (view && store) {
                eventSource = store.getEventSource();
                range = Ext.calendar.date.Util.expandRange(view.getView().doRecalculate(value).full);

                eventSource.setRange(range);
                view.setValue(value);
            }
        },

        setViewCfg: function(setterName, value) {
            if (!this.isConfiguring) {
                var view = this.activeView;
                if (view) {
                    view[setterName](value);
                }
            }
        }
    }
});