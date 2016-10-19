Ext.define('Ext.theme.material.plugin.PullRefresh', {
    override: 'Ext.plugin.PullRefresh',

    updateContent: false,
    animateOverlayHide: true,

    config: {
        overlay: true,

        offsets: {
            maxPull: '35%',
            activate: '15%',
            loading: '5%'
        },

        pullTpl: [
            '<div class="' + Ext.baseCSSPrefix + 'shadow ' + Ext.baseCSSPrefix + 'pullrefresh-loading-wrap">',
                '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-main">',
                    '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-loader-wrapper">',
                        '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-arrow-wrapper">',
                            '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-arrow-main"></div>',
                        '</div>',
                        '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-spinner-wrapper">',
                            '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-spinner-main">',
                                '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-spinner-left">',
                                    '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-half-circle"></div>',
                                '</div>',
                                '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-spinner-right">',
                                    '<div class="' + Ext.baseCSSPrefix + 'pullrefresh-md-half-circle"></div>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')
    },

    updateOverlay: function(overlay, oldOverlay) {
        this.callParent([overlay, oldOverlay]);
        this.setHideAnimation(overlay ? {
            type: 'popOut'
        } : null);
    },

    privates: {
        arrowMainSelector: '.' + Ext.baseCSSPrefix + 'pullrefresh-md-arrow-main',
        spinnerWrapperSelector: '.' + Ext.baseCSSPrefix + 'pullrefresh-md-spinner-wrapper',
        mainSelector: '.' + Ext.baseCSSPrefix + 'pullrefresh-md-main',

        setState: function(state) {
            var me = this,
                load;

            if (state !== me.$state) {
                load = state === 'loading' || state === 'loaded';
                me.element.down(me.arrowMainSelector).setVisible(!load);
                me.element.down(me.spinnerWrapperSelector).setVisible(load);
            }
            me.callParent([state]);
        },

        onMove: function(pct) {
            var me = this;

            Ext.fly(me.element.down(me.mainSelector)).setOpacity(pct);
            Ext.fly(me.element.down(me.arrowMainSelector)).dom.style.transform = 'rotate(' + (Math.floor(pct * 100 * 3.6) - 110) + 'deg)';
        }
    }
});