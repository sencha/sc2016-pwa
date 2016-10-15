Ext.define('PWA.store.Personnel', {
    extend: 'Ext.data.Store',

    alias: 'store.personnel',

    fields: [
        'name', 'email', 'phone'
    ],

    autoLoad: false,

    proxy: {
        type: 'ajax',
        // @cache({ handler: "networkFirst", cache: { name: "api" } })
        url: 'resources/data/users.json',
        reader: {
            type: 'json'
        }
    }
});
