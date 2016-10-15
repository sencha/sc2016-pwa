/**
 * The d3.svg.axis component is used to display reference lines for D3 scales.
 * The Ext.d3.axis.Axis component wraps both with an added ability to display an axis title
 * in the user specified position. This allows to configure axes declaratively
 * in any D3 component that uses them, instead of using D3's method chaining, which
 * would look quite alien in Ext views, as well as pose some technical and interoperability
 * issues.
 * The axis is designed to work with the {@link Ext.d3.svg.Svg} component.
 */
Ext.define('Ext.d3.axis.Axis', {
    requires: [
        'Ext.d3.Helpers'
    ],

    mixins: {
        observable: 'Ext.mixin.Observable',
        detached: 'Ext.d3.mixin.Detached'
    },

    config: {
        /**
         * @cfg {Object} axis
         * A `d3.svg.axis` config object or a `d3.svg.axis` instance itself.
         * In case of a config object, the property names should represent `d3.svg.axis` methods,
         * while the property value should repsent method's parameter(s). In case the method takes multiple
         * parameters, the property name should be prefixed with the dollar sign, and the property
         * value should be an array of parameters. Additionally, the values should not reference
         * the global `d3` variable, as the `d3` dependency is unlikely to be loaded at the time
         * of component definition. So a value such as `d3.time.days` should be made a string
         * `'d3.time.days'` that does not have any dependencies and will be evaluated at a later time,
         * when `d3` is already loaded.
         * For example, this
         *
         *     d3.svg.axis().orient('bottom').ticks(d3.time.days).tickFormat(d3.time.format('%b %d'));
         *
         * is equivalent to this:
         *
         *     {
         *         orient: 'bottom',
         *         ticks: 'd3.time.days',
         *         tickFormat: "d3.time.format('%b %d')"
         *     }
         *
         * Please see the D3's [SVG Axes](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md)
         * documentation for more details.
         */
        axis: {
            orient: 'top'
        },

        /**
         * @cfg {Object/Function} scale
         * A D3 scale or its config object.
         * In case of a config object, the property names should represent a particular scale's methods,
         * while the property value should repsent method's parameter(s). In case the method takes multiple
         * parameters, the property name should be prefixed with the dollar sign, and the property
         * value should be an array of parameters. Additionally, the values should not reference
         * the global `d3` variable, as the `d3` dependency is unlikely to be loaded at the time
         * of component definition. So a value such as `d3.range(0, 100, 20)` should be made a string
         * `'d3.range(0, 100, 20)'` that does not have any dependencies and will be evaluated at a later time,
         * when `d3` is already loaded.
         * For example, this
         *
         *     d3.scale.linear().range(d3.range(0, 100, 20));
         *
         * is equivalent to this:
         *
         *     {
         *         type: 'linear',
         *         range: 'd3.range(0, 100, 20)'
         *     }
         *
         * Please see the D3's [Scales](https://github.com/d3/d3-3.x-api-reference/blob/master/Scales.md)
         * documentation for more details.
         */
        scale: {
            type: 'linear'
        },

        /**
         * @cfg {Object} title
         * @cfg {String} title.text Axis title text.
         * @cfg {String} [title.position='outside']
         * Controls the vertical placement of the axis title. Available options are:
         *
         *   - `'outside'`: axis title is placed on the tick side
         *   - `'inside'`: axis title is placed on the side with no ticks
         *
         * @cfg {String} [title.alignment='middle']
         * Controls the horizontal placement of the axis title. Available options are:
         *
         *   - `'middle'`, `'center'`: axis title is placed in the middle of the axis line
         *   - `'start'`, `'left'`: axis title is placed at the start of the axis line
         *   - `'end'`, `'right'`: axis title is placed at the end of the axis line
         *
         * @cfg {String} [title.padding='0.5em']
         * The gap between the title and axis labels.
         */
        title: null,

        /**
         * @cfg {SVGElement/d3.selection} parent
         * The parent group of the d3.svg.axis as either an SVGElement or a D3 selection.
         */
        parent: null,

        /**
         * @cfg {Ext.d3.svg.Svg} component
         * The SVG component that owns this axis.
         */
        component: null
    },

    defaultCls: {
        self: Ext.baseCSSPrefix + 'd3-axis',
        title: Ext.baseCSSPrefix + 'd3-axis-title'
    },

    title: null,
    group: null,
    domain: null,

    constructor: function (config) {
        var me = this,
            id;

        config = config || {};

        if ('id' in config) {
            id = config.id;
        } else if ('id' in me.config) {
            id = me.config.id;
        } else {
            id = me.getId();
        }
        me.setId(id);

        me.mixins.detached.constructor.call(me, config);
        me.group = me.getDetached().append('g')
            .classed(me.defaultCls.self, true)
            .attr('id', me.getId());

        me.mixins.observable.constructor.call(me, config);
    },

    getGroup: function () {
        return this.group;
    },

    getBox: function () {
        return this.group.node().getBBox();
    },

    applyScale: function (scale, oldScale) {
        var axis = this.getAxis();

        if (scale) {
            if (!Ext.isFunction(scale)) {
                scale = Ext.d3.Helpers.makeScale(scale);
            }
            if (axis) {
                axis.scale(scale);
            }
        }
        return scale || oldScale;
    },

    applyAxis: function (axis, oldAxis) {
        var scale = this.getScale();

        if (axis) {
            if (!Ext.isFunction(axis)) { // if `axis` is not already a d3.svg.axis
                if (oldAxis) { // reconfigure
                    axis = Ext.d3.Helpers.configure(oldAxis, axis);
                } else { // create
                    axis = Ext.d3.Helpers.make('svg.axis', axis);
                }
            }
            if (scale) {
                axis.scale(scale);
            }
        }

        return axis || oldAxis;
    },

    updateParent: function (parent) {
        var me = this,
            axis = me.getAxis();

        if (parent) {
            // Move axis `group` from `detached` to `parent`.
            me.attach(parent, me.group);
            me.render();
        } else {
            me.detach(me.group);
        }
    },

    updateTitle: function (title) {
        var me = this;

        if (title) {
            if (me.title) {
                if (me.isDetached(me.title)) {
                    me.attach(me.group, me.title);
                }
            } else {
                me.title = me.group.append('text').classed(me.defaultCls.title, true);
            }
            me.title.text(title.text || '');
            me.title.attr(title.attr);
            me.positionTitle(title);
        } else {
            if (me.title) {
                me.detach(me.title);
            }
        }
    },

    getAxisLine: function () {
        var me = this,
            domain = me.domain;

        if (!domain) {
            domain = me.group.select('path.domain');
        }

        return domain.empty() ? null : (me.domain = domain);
    },

    getTicksBBox: function () {
        var me = this,
            group = me.group,
            groupNode, temp, tempNode,
            ticks, bbox;

        ticks = group.selectAll('.tick');

        if (ticks.size()) {
            temp = group.append('g');
            tempNode = temp.node();
            groupNode = group.node();

            ticks.each(function () {
                tempNode.appendChild(this);
            });
            bbox = tempNode.getBBox();

            ticks.each(function () {
                groupNode.appendChild(this);
            });
            temp.remove();
        }

        return bbox;
    },

    positionTitle: function (cfg) {
        var me = this,
            title = me.title,
            axis = me.getAxis(),
            line = me.getAxisLine(),
            orient = axis.orient(),
            isVertical = orient === 'left' || orient === 'right',
            Helpers = Ext.d3.Helpers,
            beforeEdge = 'text-before-edge',
            afterEdge = 'text-after-edge',
            alignment, position, padding,
            textAnchor, isOutside,
            lineBBox, ticksBBox,
            x = 0,
            y = 0;

        // See https://sencha.jira.com/browse/EXTJS-21421.
        // The scene may be insivible at this point, e.g. because we hide it in the 'setupScene' method
        // of the HeatMap component (see its comments).
        // The component itself is inside a document fragment during initialization.
        if (!(line && title && Ext.d3.Helpers.isBBoxable(me.getParent()))) {
            return;
        }

        cfg = cfg || me.getTitle();

        lineBBox = line.node().getBBox();
        ticksBBox = me.getTicksBBox();

        alignment = cfg.alignment || 'middle';
        position = cfg.position || 'outside';
        isOutside = position === 'outside';
        padding = cfg.padding || '0.5em';

        switch (alignment) {
            case 'start':
            case 'left':
                textAnchor = 'start';
                if (isVertical) {
                    y = lineBBox.y + lineBBox.height;
                } else {
                    x = lineBBox.x;
                }
                break;
            case 'end':
            case 'right':
                textAnchor = 'end';
                if (isVertical) {
                    y = lineBBox.y ;
                } else {
                    x = lineBBox.x + lineBBox.width;
                }
                break;
            case 'middle':
            case 'center':
                textAnchor = 'middle';
                if (isVertical) {
                    y = lineBBox.y + lineBBox.height / 2;
                } else {
                    x = lineBBox.x + lineBBox.width / 2;
                }
                break;
        }

        switch (orient) {
            case 'top':
                if (isOutside) {
                    title.attr('y', ticksBBox ? ticksBBox.y : 0);
                    padding = Helpers.unitMath(padding, '*', -1);
                }
                Helpers.setDominantBaseline(title.node(), isOutside ? afterEdge : beforeEdge);
                title
                    .attr('text-anchor', textAnchor)
                    .attr('x', x);
                break;
            case 'bottom':
                if (isOutside) {
                    title.attr('y', ticksBBox ? ticksBBox.y + ticksBBox.height : 0);
                } else {
                    padding = Helpers.unitMath(padding, '*', -1);
                }
                Helpers.setDominantBaseline(title.node(), isOutside ? beforeEdge : afterEdge);
                title
                    .attr('text-anchor', textAnchor)
                    .attr('x', x);
                break;
            case 'left':
                if (isOutside) {
                    x = ticksBBox ? ticksBBox.x : 0;
                    padding = Helpers.unitMath(padding, '*', -1);
                }
                Helpers.setDominantBaseline(title.node(), isOutside ? afterEdge : beforeEdge);
                title
                    .attr('text-anchor', textAnchor)
                    .attr('transform', 'translate(' + x + ', ' + y + ')' + 'rotate(-90)');
                break;
            case 'right':
                if (isOutside) {
                    x = ticksBBox ? ticksBBox.x + ticksBBox.width: 0;
                } else {
                    padding = Helpers.unitMath(padding, '*', -1);
                }
                Helpers.setDominantBaseline(title.node(), isOutside ? beforeEdge : afterEdge);
                title
                    .attr('text-anchor', textAnchor)
                    .attr('transform', 'translate(' + x + ', ' + y + ')' + 'rotate(-90)');
                break;
        }

        title.attr('dy', padding);
    },

    render: function (transition) {
        var me = this,
            axis = me.getAxis(),
            orient = axis.orient(),
            scale = me.getScale();

        if (!(scale.domain().length && scale.range().length)) {
            return;
        }

        if (transition) {
            transition.select('#' + me.getId()).call(axis);
        } else {
            me.group.call(axis);
        }
        // It's crucial to set the 'data-orient' attribute before the call
        // to the positionTitle in order for the getTicksBBox method to
        // work correctly.
        me.group.attr('data-orient', orient);
        me.positionTitle();
    },

    destroy: function () {
        this.mixins.detached.destroy.call(this);
    }
});
