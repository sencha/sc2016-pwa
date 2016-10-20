Ext.define('PWA.store.Personnel', {
    extend: 'Ext.data.Store',

    alias: 'store.personnel',

    model: 'PWA.model.Person',

    autoLoad: true,

    proxy: {
        type: 'ajax',

        url: '/personnel.json',

        reader: {
            type: 'json'
        }
    }
});
