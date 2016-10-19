/**
 * `Ext.d3.axis.Data` is an {@link Ext.d3.axis.Axis} that holds extra information
 * needed for use with stores.
 */
Ext.define('Ext.d3.axis.Data', {
    extend: 'Ext.d3.axis.Axis',

    config: {
        /**
         * @cfg {String} field An Ext.data.Model field name.
         */
        field: null,
        /**
         * @cfg {Number} step The step of an axis. Indicates the extent of a single data chunk.
         * E.g. `24 * 60 * 60 * 1000` (one day) for a time axis.
         */
        step: null
    },

    applyAxis: function (axis, oldAxis) {
        var axis = this.callParent([axis, oldAxis]),
            component = this.getComponent(),
            isRtl = component.getInherited().rtl,
            orient;

        if (axis && isRtl) {
            orient = axis.orient();
            if (orient === 'left') {
                axis.orient('right');
            } else if (orient === 'right') {
                axis.orient('left');
            }
        }

        return axis;
    }

});