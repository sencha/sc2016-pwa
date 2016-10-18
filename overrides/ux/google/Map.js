Ext.define('App.overrides.ux.google.Map', {
    override: 'Ext.ux.google.Map',

    /**
     * [FIX] Make sure that the map is initially correctly centered on first resize.
     */
    doResize: function() {
        var map = this.getMap(),
            center = map && map.getCenter();

        this.callParent(arguments);
        if (center) {
            map.setCenter(center);
        }
    }
});
