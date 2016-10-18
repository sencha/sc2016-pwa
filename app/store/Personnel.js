Ext.define('PWA.store.Personnel', {
    extend: 'Ext.data.Store',

    alias: 'store.personnel',

    fields: [
        'name', 'email', 'phone'
    ],

    autoLoad: true,

    proxy: {
        type: 'ajax',
        // @cache({ handler: "networkFirst", cache: { name: "api" } })
        url: 'resources/data/list.json',
        reader: {
            type: 'json'
        }
    }
});
