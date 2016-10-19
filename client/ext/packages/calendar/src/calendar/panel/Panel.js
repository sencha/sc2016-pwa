/**
 * This class is the main calendar panel, it wraps {@link Ext.calendar.view.Multi}.
 *
 * It allows switching between multiple views of the same dataset. It
 * is composed of the other calendar types such as {@link Ext.calendar.panel.Month},
 * {@link Ext.calendar.panel.Week} and {@link Ext.calendar.panel.Day}.
 *
 * It also provides extra UI features like a switcher button, title bar and navigation
 * buttons.
 */
Ext.define('Ext.calendar.panel.Panel', {
    extend: 'Ext.calendar.panel.AbstractPanel',
    xtype: 'calendar',

    mixins: ['Ext.mixin.ConfigState'],
    alternateStateConfig: 'compactOptions',

    requires: [
        'Ext.calendar.panel.Day',
        'Ext.calendar.panel.Week',
        'Ext.calendar.panel.Month',
        'Ext.calendar.List',
        'Ext.calendar.view.Multi',
        'Ext.calendar.date.Util'
    ],

    referenceHolder: true,

    platformConfig: {
        '!desktop':  {
            compact: true
        }
    },

    config: {
        /**
         * @cfg {Object} calendarList
         * The config for creating the calendar list.
         */
        calendarList: {
            xtype: 'calendar-list',
            reference: 'list',
            flex: 1
        },

        /**
         * @inheritdoc Ext.calendar.view.Multi#compact
         */
        compact: false,

        /**
         * @inheritdoc Ext.calendar.view.Multi#compactOptions
         */
        compactOptions: {},

        /**
         * @cfg {Object} calendarList
         * The config for creating the create button.
         */
        createButton: {
            xtype: 'button',
            cls: Ext.baseCSSPrefix + 'calendar-panel-create-button',
            text: 'Create'
        },

        /**
         * @cfg {String} createButtonPosition
         * The position for the create button. Can be `sideBar` or `titleBar`.
         */
        createButtonPosition: 'sideBar',

        /**
         * @cfg {Object} dateTitle
         * The config for the date title.
         */
        dateTitle: {
            xtype: 'component',
            reference: 'calTitle',
            cls: Ext.baseCSSPrefix + 'calendar-panel-title',
            margin: '0 0 0 10'
        },

        /**
         * @cfg {Object} nextButton
         * The configuration for the next navigation button.
         */
        nextButton: {
            xtype: 'button',
            text: '>'
        },

        /**
         * @cfg {Object} nextButton
         * The configuration for the previous navigation button.
         */
        previousButton: {
            xtype: 'button',
            text: '<'
        },

        /**
         * @cfg {Object} sideBar
         * The configuration for the sidebar. Extra items can be added/inserted into
         * the sidebar by adding the items configuration. Items will be sorted by a `weight`
         * property. Existing items in the sidebar have weights `0-100` with an increment of 10
         * for each item. Use a number less than 0 to insert at the front. Use a number larger than 100
         * to insert at the end.
         */
        sideBar: {
            xtype: 'panel',
            cls: Ext.baseCSSPrefix + 'calendar-sidebar'
        },

        /**
         * @cfg {Object/Ext.calendar.store.Calendars} store
         * A calendar store instance or configuration.
         */
        store: null,

        /**
         * @inheritdoc Ext.calendar.view.Multi#store
         */
        switcher: {
            xtype: 'segmentedbutton',
            reference: 'switcher',
            cls: Ext.baseCSSPrefix + 'calendar-panel-switcher',
            allowMultiple: false
        },

        /**
         * @cfg {String} switcherPosition
         * The position for the create button. Can be `sideBar` or `titleBar`.
         */
        switcherPosition: 'titleBar',

        /**
         * @inheritdoc Ext.calendar.view.Multi#timezoneOffset
         */
        timezoneOffset: undefined,

        /**
         * @cfg {Object} titleBar
         * The configuration for the titleBar. Extra items can be added/inserted into
         * the sidebar by adding the items configuration. Items will be sorted by a `weight`
         * property. Existing items in the sidebar have weights `0-100` with an increment of 10
         * for each item. Use a number less than 0 to insert at the front. Use a number larger than 100
         * to insert at the end.
         */
        titleBar: {
            xtype: 'toolbar'
        },

        /**
         * @cfg {Object} todayButton
         * The configuration for the today button.
         */
        todayButton: {
            xtype: 'button',
            text: 'Today',
            margin: '0 10 0 0'
        },

        /**
         * @inheritdoc Ext.calendar.view.Multi#value
         */
        value: undefined,

        //<locale>
        /**
         * @cfg {Object} views
         * The calendar views to have available, each item in
         * this configuration (labelled by a key) is to contain
         * the configuration for the view, a class that extends
         * {@link Ext.calendar.panel.Base}. There are also other
         * configurations available only when used in conjunction
         * with this panel:
         *
         * - `label` - A label to display on the switcher display.
         * - `weight` - A number to indicate the order in which items are
         * displayed, lower numbers are displayed first.
         * - `titleTpl` - A template string for displaying the current date title.
         * The values passed are the start and end dates.
         */
        views: {
            day: {
                xtype: 'calendar-day',
                titleTpl: '{start:date("l F d, Y")}',
                controlStoreRange: false,
                label: 'Day',
                weight: 10,
                dayHeader: null
            },
            week: {
                xtype: 'calendar-week',
                dayHeaderFormat: 'D d',
                controlStoreRange: false,
                titleTpl: '{start:date("j M")} - {end:date("j M Y")}',
                label: 'Week',
                weight: 20
            },
            month: {
                xtype: 'calendar-month',
                titleTpl: '{start:date("F Y")}',
                label: 'Month',
                weight: 30
            }
        }
        //</locale>
    },

    /**
     * @cfg {String} defaultView
     * The key of the item from {@link #views} to use as the default.
     */
    defaultView: 'month',

    cls: Ext.baseCSSPrefix + 'calendar-panel',

    /**
     * @method getCalendarList
     * @hide
     */

    /**
     * @method setCalendarList
     * @hide
     */

    /**
     * @method getCreateButton
     * @hide
     */

    /**
     * @method setCreateButton
     * @hide
     */

    /**
     * @method getNextButton
     * @hide
     */

    /**
     * @method setNextButton
     * @hide
     */

    /**
     * @method getPreviousButton
     * @hide
     */

    /**
     * @method setPreviousButton
     * @hide
     */

    /**
     * @method getSideBar
     * @hide
     */

    /**
     * @method setSideBar
     * @hide
     */

    /**
     * @method getSwitcher
     * @hide
     */

    /**
     * @method setSwitcher
     * @hide
     */

    /**
     * @method getTitleBar
     * @hide
     */

    /**
     * @method setTitleBar
     * @hide
     */

    /**
     * @method getTodayButton
     * @hide
     */

    /**
     * @method setTodayButton
     * @hide
     */

    /**
     * @method setViews
     * @hide
     */

    /**
     * Moves the active view forward. The amount moved
     * depends on the current view.
     */
    moveNext: function() {
        this.getView().moveNext();
    },

    /**
     * Moves the active view backward. The amount moved
     * depends on the current view.
     */
    movePrevious: function() {
        this.getView().movePrevious();
    },

    /**
     * Move the current view by an amount based of the current {@link #value}.
     * @param {Number} amount The number of intervals to move.
     * @param {String} [interval=Ext.Date.DAY] The interval to navigate by. See {@link Ext.Date}
     * for valid intervals.
     */
    navigate: function(amount, interval) {
        this.getView().navigate(amount, interval);
    },

    /**
     * Set the active view.
     * @param {String} view The view name from {@link #views}.
     */
    setView: function(view) {
        this.getView().setView(view);
        this.refreshCalTitle();
    },

    // Appliers/Updaters
    updateCompact: function(compact, oldCompact) {
        var me = this;

        me.toggleCls(Ext.baseCSSPrefix + 'compact', compact);

        me.toggleConfigState(compact);
        me.callParent([compact, oldCompact]);
        me.setViewCfg('setCompact', compact);
    },

    updateCompactOptions: function() {
        if (!this.isConfiguring && this.getCompact()) {
            this.toggleConfigState(true);
        }
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.StoreManager.lookup(store, 'calendar-calendars');
        }
        return store;
    },

    updateStore: function(store) {
        var list = this.lookup('list');
        this.setViewCfg('setStore', store);
        if (list) {
            list.setStore(store);
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
        this.setViewCfg('setValue', value);
        this.refreshCalTitle();
    },

    getValue: function() {
        var view = this.getView();
        return view ? view.getValue() : this.callParent();
    },

    // Protected
    getView: function() {
        return this.lookup('view');
    },

    privates: {
        weightStart: 0,
        weightIncrement: 10,

        createCalendarList: function(cfg) {
            return Ext.apply({
                store: this.getStore()
            }, this.getCalendarList());
        },

        createCreateButton: function(cfg) {
            cfg = cfg || {};
            cfg = Ext.apply(cfg, this.getCreateButton());
            return Ext.apply({
                handler: 'onCreateTap',
                scope: this
            }, cfg);
        },

        createContainerWithChildren: function(defaults, cfg, items) {
            cfg = Ext.apply({}, cfg);

            var me = this,
                cfgItems = cfg.items,
                weight = me.weightStart,
                incr = me.weightIncrement,
                len, i, item;

            if (cfgItems) {
                if (!Ext.isArray(cfgItems)) {
                    cfgItems = [cfgItems];
                }

                for (i = 0, len = items.length; i < len; ++i) {
                    item = items[i];
                    if (item.weight == null) {
                        item = Ext.apply({
                            weight: weight
                        }, item);
                    }
                    weight += incr;
                }

                items = items.concat(cfgItems);
                Ext.Array.sort(items, me.weightSorter);
                delete cfg.items;
            }
            cfg.items = items;

            return Ext.apply(cfg, defaults);
        },

        createDateTitle: function(cfg) {
            cfg = cfg || {};
            return Ext.apply(cfg, this.getDateTitle());
        },

        createNextButton: function() {
            return Ext.apply({
                handler: 'onNextTap',
                scope: this
            }, this.getNextButton());
        },

        createPreviousButton: function() {
            return Ext.apply({
                handler: 'onPrevTap',
                scope: this
            }, this.getPreviousButton());
        },

        createSwitcher: function(cfg) {
            var me = this,
                view = me.getView();

            cfg = Ext.apply({
                value: (view && view.getActiveKey()) || me.defaultView,
                listeners: {
                    scope: me,
                    change: 'onSwitcherChange'
                },
                items: me.getSwitcherItems()
            }, cfg);

            return Ext.apply(cfg, me.getSwitcher());
        },

        createTodayButton: function() {
            return Ext.apply({
                handler: 'onTodayTap',
                scope: this
            }, this.getTodayButton());
        },

        createView: function() {
            var me = this;
            return {
                xtype: 'calendar-multiview',
                reference: 'view',
                compact: me.getCompact(),
                defaultView: me.defaultView,
                store: me.getStore(),
                timezoneOffset: me.autoOffset ? undefined : me.getTimezoneOffset(),
                value: me.getValue(),
                views: me.getViews(),
                listeners: {
                    scope: me,
                    valuechange: 'onValueChange'
                }
            };
        },

        getSwitcherItems: function() {
            var views = this.getViews(),
                items = [],
                key, o;

            for (key in views) {
                o = views[key];
                items.push({
                    text: o.label,
                    value: key,
                    weight: o.weight
                });
            }

            items.sort(this.weightSorter);
            return items;
        },

        onCreateTap: function() {
            this.getView().showAddForm();
        },

        onNextTap: function() {
            this.moveNext();
        },

        onPrevTap: function() {
            this.movePrevious();
        },

        onValueChange: function(view, context) {
            this.setValue(context.value);
        },

        onTodayTap: function() {
            this.setValue(new Date());
        },

        refreshCalTitle: function() {
            var me = this,
                view = me.getView(),
                calTitle = me.lookup('calTitle'),
                tpl;

            if (view && calTitle) {
                view = view.activeView;
                tpl = view.lookupTpl('titleTpl');
                if (tpl) {
                    calTitle.setHtml(tpl.apply(view.getDisplayRange()));
                }
            }
        },

        setViewCfg: function(setterName, value) {
            if (!this.isConfiguring) {
                var view = this.getView();
                if (view) {
                    view[setterName](value);
                }
            }
        },

        weightSorter: function(a, b) {
            return a.weight - b.weight;
        }
    }
});