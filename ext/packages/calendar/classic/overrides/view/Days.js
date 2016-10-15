Ext.define('Ext.overrides.calendar.view.Days', {
    override: 'Ext.calendar.view.Days',

    requires: [
        'Ext.calendar.form.Edit',
        'Ext.calendar.form.Add'
    ],

    privates: {
        doRefresh: function() {
            this.callParent();
            this.updateLayout();
        },

        doRefreshEvents: function() {
            var me = this;

            me.callParent();
            me.syncHeaderScroll();
            // private
            me.fireEvent('eventrefresh', me, {});
        }
    }
});