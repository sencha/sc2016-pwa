/**
 * This view is an example list of people.
 */
Ext.define('PWA.view.main.List', {
    extend: 'Ext.dataview.List',
    xtype: 'mainlist',

    requires: [
        'Ext.plugin.PullRefresh'
    ],

    title: 'Personnel',

    bind: {
        store: '{personnel}'
    },

    plugins: [
        {
            xclass: 'Ext.plugin.PullRefresh',
            pullText: 'Pull down for more new Tweets!'
        }
    ],

    columns: [
        { text: 'Name',  dataIndex: 'name', width: 100 },
        { text: 'Email', dataIndex: 'email', width: 230 },
        { text: 'Phone', dataIndex: 'phone', width: 150 }
    ],

    itemTpl: [
        '<div>{name}</div>'
    ],

    listeners: {
        select: 'onItemSelected'
    }
});
