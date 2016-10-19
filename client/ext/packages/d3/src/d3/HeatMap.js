/**
 * The 'd3-heatmap' component is used for visualizing matrices
 * where the individual values are represented as colors.
 * The component makes use of two {@link Ext.d3.axis.Data Data} axes (one for each
 * dimension of the matrix) and a single {@link Ext.d3.axis.Color Color} axis
 * to encode the values.
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         renderTo: Ext.getBody(),
 *         title: 'Heatmap Chart',
 *         height: 750,
 *         width: 750,
 *         layout: 'fit',
 *         items: [
 *             {
 *                 xtype: 'd3-heatmap',
 *                 padding: {
 *                     top: 20,
 *                     right: 30,
 *                     bottom: 20,
 *                     left: 80
 *                 },
 *
 *                 xAxis: {
 *                     axis: {
 *                         ticks: 'd3.time.days',
 *                         tickFormat: "d3.time.format('%b %d')",
 *                         orient: 'bottom'
 *                     },
 *                     scale: {
 *                         type: 'time'
 *                     },
 *                     title: {
 *                         text: 'Date'
 *                     },
 *                     field: 'date',
 *                     step: 24 * 60 * 60 * 1000
 *                 },
 *
 *                 yAxis: {
 *                     axis: {
 *                         orient: 'left'
 *                     },
 *                     scale: {
 *                         type: 'linear'
 *                     },
 *                     title: {
 *                         text: 'Total'
 *                     },
 *                     field: 'bucket',
 *                     step: 100
 *                 },
 *
 *                 colorAxis: {
 *                     scale: {
 *                         type: 'linear',
 *                         range: ['white', 'orange']
 *                     },
 *                     field: 'count',
 *                     minimum: 0
 *                 },
 *
 *                 tiles: {
 *                     attr: {
 *                         'stroke': 'black',
 *                         'stroke-width': 1
 *                     }
 *                 },
 *
 *                 store: {
 *                     fields: [
 *                         {name: 'date', type: 'date', dateFormat: 'Y-m-d'},
 *                         'bucket',
 *                         'count'
 *                     ],
 *                     data: [
 *                         { "date": "2012-07-20", "bucket": 800, "count": 119 },
 *                         { "date": "2012-07-20", "bucket": 900, "count": 123 },
 *                         { "date": "2012-07-20", "bucket": 1000, "count": 173 },
 *                         { "date": "2012-07-20", "bucket": 1100, "count": 226 },
 *                         { "date": "2012-07-20", "bucket": 1200, "count": 284 },
 *                         { "date": "2012-07-21", "bucket": 800, "count": 123 },
 *                         { "date": "2012-07-21", "bucket": 900, "count": 165 },
 *                         { "date": "2012-07-21", "bucket": 1000, "count": 237 },
 *                         { "date": "2012-07-21", "bucket": 1100, "count": 278 },
 *                         { "date": "2012-07-21", "bucket": 1200, "count": 338 },
 *                         { "date": "2012-07-22", "bucket": 900, "count": 154 },
 *                         { "date": "2012-07-22", "bucket": 1000, "count": 241 },
 *                         { "date": "2012-07-22", "bucket": 1100, "count": 246 },
 *                         { "date": "2012-07-22", "bucket": 1200, "count": 300 },
 *                         { "date": "2012-07-22", "bucket": 1300, "count": 305 },
 *                         { "date": "2012-07-23", "bucket": 800, "count": 120 },
 *                         { "date": "2012-07-23", "bucket": 900, "count": 156 },
 *                         { "date": "2012-07-23", "bucket": 1000, "count": 209 },
 *                         { "date": "2012-07-23", "bucket": 1100, "count": 267 },
 *                         { "date": "2012-07-23", "bucket": 1200, "count": 299 },
 *                         { "date": "2012-07-23", "bucket": 1300, "count": 316 },
 *                         { "date": "2012-07-24", "bucket": 800, "count": 105 },
 *                         { "date": "2012-07-24", "bucket": 900, "count": 156 },
 *                         { "date": "2012-07-24", "bucket": 1000, "count": 220 },
 *                         { "date": "2012-07-24", "bucket": 1100, "count": 255 },
 *                         { "date": "2012-07-24", "bucket": 1200, "count": 308 },
 *                         { "date": "2012-07-25", "bucket": 800, "count": 104 },
 *                         { "date": "2012-07-25", "bucket": 900, "count": 191 },
 *                         { "date": "2012-07-25", "bucket": 1000, "count": 201 },
 *                         { "date": "2012-07-25", "bucket": 1100, "count": 238 },
 *                         { "date": "2012-07-25", "bucket": 1200, "count": 223 },
 *                         { "date": "2012-07-26", "bucket": 1300, "count": 132 },
 *                         { "date": "2012-07-26", "bucket": 1400, "count": 117 },
 *                         { "date": "2012-07-26", "bucket": 1500, "count": 124 },
 *                         { "date": "2012-07-26", "bucket": 1600, "count": 154 },
 *                         { "date": "2012-07-26", "bucket": 1700, "count": 167 }
 *                     ]
 *                 }
 *             }
 *         ]
 *     });
 */
Ext.define('Ext.d3.HeatMap', {
    extend: 'Ext.d3.svg.Svg',
    xtype: 'd3-heatmap',

    requires: [
        'Ext.d3.axis.Data',
        'Ext.d3.axis.Color',
        'Ext.d3.legend.Color',
        'Ext.d3.Helpers'
    ],

    mixins: [
        'Ext.d3.mixin.ToolTip'
    ],

    config: {

        componentCls: 'heatmap',

        /**
         * @cfg {Ext.d3.axis.Data} xAxis
         * The axis that corresponds to the columns of the data matrix.
         */
        xAxis: {
            axis: {
                orient: 'bottom'
            },
            scale: {
                type: 'linear'
            }
        },

        /**
         * @cfg {Ext.d3.axis.Data} yAxis
         * The axis that corresponds to the rows of the data matrix.
         */
        yAxis: {
            axis: {
                orient: 'left'
            },
            scale: {
                type: 'linear'
            }
        },

        /**
         * @cfg {Ext.d3.axis.Color} colorAxis
         * The axis that corresponds to the values of the data matrix.
         */
        colorAxis: {},

        /**
         * @cfg {Ext.d3.legend.Color} legend
         * The legend for tiles' colors.
         * See the {@link Ext.d3.legend.Color} documentation for configuration options.
         */
        legend: false,

        /**
         * @cfg {Object} tiles
         * This config controls the appearance of the heatmap tiles.
         * @cfg {String} tiles.cls The CSS class name to use for each tile.
         * @cfg {Object} tiles.attr The attributes to apply to each tile ('rect') element.
         */
        tiles: null,

        /**
         * @cfg {Object/Boolean} [labels=true]
         * This config controls the appearance of the heatmap labels.
         * @cfg {String} labels.cls The CSS class name to use for each label.
         * @cfg {Object} labels.attr The attributes to apply to each label ('text') element.
         */
        labels: true

    },

    data: null, // store data items
    tiles: null,
    tilesGroup: null,

    tilesRect: null,
    legendRect: null,

    defaultCls: {
        tiles: Ext.baseCSSPrefix + 'd3-tiles',
        tile: Ext.baseCSSPrefix + 'd3-tile',
        label: Ext.baseCSSPrefix + 'd3-tile-label'
    },

    constructor: function (config) {
        this.callParent([config]);
        this.mixins.d3tooltip.constructor.call(this, config);
    },

    applyTooltip: function (tooltip, oldTooltip) {
        if (tooltip) {
            tooltip.delegate = 'g.' + this.defaultCls.tile;
        }
        return this.mixins.d3tooltip.applyTooltip.call(this, tooltip, oldTooltip);
    },

    updateTooltip: null, // Override the updater in Modern component.

    applyAxis: function (axis, oldAxis) {
        if (axis) {
            axis = new Ext.d3.axis.Data(Ext.merge({
                parent: this.getScene(),
                component: this
            }, axis));
        }
        return axis || oldAxis;
    },

    updateAxis: function (axis, oldAxis) {
        var me = this;

        if (!me.isConfiguring) {
            me.processData();
            me.renderScene();
        }
    },

    applyXAxis: function (xAxis, oldXAxis) {
        return this.applyAxis(xAxis, oldXAxis);
    },

    updateXAxis: function () {
        this.updateAxis();
    },

    applyYAxis: function (yAxis, oldYAxis) {
        return this.applyAxis(yAxis, oldYAxis);
    },

    updateYAxis: function () {
        this.updateAxis();
    },

    applyLegend: function (legend, oldLegend) {
        var me = this;

        if (legend) {
            legend.axis = me.getColorAxis();
            legend = new Ext.d3.legend.Color(Ext.merge({component: me}, legend));
        }
        return legend || oldLegend;
    },

    updateLegend: function (legend, oldLegend) {
        var me = this,
            events = {
                show: 'onLegendVisibility',
                hide: 'onLegendVisibility',
                scope: me
            };

        if (oldLegend) {
            oldLegend.un(events);
        }

        if (legend) {
            legend.on(events);
        }

        if (!me.isConfiguring) {
            me.performLayout();
        }
    },

    onLegendVisibility: function () {
        this.performLayout();
    },

    applyColorAxis: function (colorAxis, oldColorAxis) {
        if (colorAxis) {
            colorAxis = new Ext.d3.axis.Color(colorAxis);
        }
        return colorAxis || oldColorAxis;
    },
    
    updateColorAxis: function () {
        var me = this;

        if (!me.isConfiguring) {
            me.processData();
            me.renderScene();
        }
    },

    getStoreData: function(store){
        return store ? store.getData().items : [];
    },

    processData: function (store) {
        var me = this,
            items = me.data = me.getStoreData(store || me.getStore()),

            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),
            colorAxis = me.getColorAxis(),

            xScale = xAxis.getScale(),
            yScale = yAxis.getScale(),

            xCategories, yCategories,

            xField = xAxis.getField(),
            yField = yAxis.getField(),

            xStep = xAxis.getStep(),
            yStep = yAxis.getStep(),

            xDomain, yDomain;

        // If an axis is using a time scale, the date format parser
        // should be specified in the store, e.g.:
        // fields: [
        //     {name: 'xField', type: 'date', dateFormat: 'Y-m-d'},
        //     ...
        // And Ext.Date.parse function will be used to parse date strings.
        // In pure D3, one typically creates a d3.time.format('%Y-%m-%d').parse
        // parser and calls it on every item's date string in a loop.
        // Here, date fields should already be Date objects.
        // Same goes for other field types, in pure D3 it's common to coerce
        // strings to numbers, e.g. `data.count = +data.count`.
        // Here, we assume all of this has been taken care of by the store.

        xDomain = d3.extent(items, function (item) { return item.data[xField]; });
        yDomain = d3.extent(items, function (item) { return item.data[yField]; });

        if (Ext.d3.Helpers.isOrdinalScale(xScale)) {
            // When an ordinal scale is used, it is assumed that the order
            // of data in the store is linear.
            // E.g. the store for the sales by employee by day heatmap
            // has all records listed for the first employee,
            // then all records for the second employee, and so on.
            // The days in the employee records are expected to be
            // ordered as well.
            // For example:
            // { employee: 'John', day: 1, sales: 5 },
            // { employee: 'John', day: 2, sales: 7 },
            // { employee: 'Jane', day: 1, sales: 4 },
            // { employee: 'Jane', day: 2, sales: 8 }

            xCategories = items.map(function (item) {
                return item.data[xField];
            }).filter(function (element, index, array) {
                // keep first or not equal previous
                // return !index || element != array[index - 1];
                // Quadratic time, but preserves order of items in both cases:
                // Case 1: 5 5 5 4 4 4 3 3 3
                // Case 2: 5 4 3 5 4 3 5 4 3
                // Both will result in the following sequence: 5 4 3.
                // Quadratic time should be acceptable as ordinal scales are not
                // expected to be used with large datasets.
                return array.indexOf(element) === index;
            });
            xScale.domain(xCategories);
        } else {
            // Coerce domain values to a number (they may be Date objects).

            // The assumption in HeatMap component is that the data values starts at
            // startValue and ends at endValue - step. So, for example, if one wants
            // to map hours along the xAxis, the data values would range from 0 to 23,
            // and one would set step to 1. If one wants to map every other hour. // TODO: finish comment
            xScale.domain([+xDomain[0], +xDomain[1] + xStep]);
        }

        if (Ext.d3.Helpers.isOrdinalScale(yScale)) {
            yCategories = items.map(function (item) {
                return item.data[yField];
            }).filter(function (element, index, array) {
                return array.indexOf(element) === index;
            });
            yScale.domain(yCategories);
        } else {
            yScale.domain([+yDomain[0], +yDomain[1] + yStep]);
        }

        colorAxis.setDomainFromData(items);
    },

    isDataProcessed: false,

    processDataChange: function (store) {
        var me = this;

        me.processData(store);
        me.isDataProcessed = true;

        if (!me.isConfiguring) {
            me.performLayout();
        }
    },

    onSceneResize: function (scene, rect) {
        var me = this;

        me.callParent([scene, rect]);
        if (!me.isDataProcessed) {
            me.processData();
        }
        me.performLayout(rect);
    },

    performLayout: function (rect) {
        var me = this;

        rect = rect || me.getSceneRect();

        if (!rect) {
            return;
        }

        me.showScene();

        var legend = me.getLegend(),

            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),

            xAxisGroup = xAxis.getGroup(),
            yAxisGroup = yAxis.getGroup(),

            xD3Axis = xAxis.getAxis(),
            yD3Axis = yAxis.getAxis(),

            xScale = xAxis.getScale(),
            yScale = yAxis.getScale(),

            isOrdinalX = Ext.d3.Helpers.isOrdinalScale(xScale),
            isOrdinalY = Ext.d3.Helpers.isOrdinalScale(yScale),

            isRtl = me.getInherited().rtl,

            legendRect, legendBox, legendDocked,
            tilesRect, shrinkRect, xRange;

        shrinkRect = {
            x: 0,
            y: 0,
            width: rect.width,
            height: rect.height
        };

        me.tilesRect = tilesRect = Ext.Object.chain(shrinkRect);

        if (legend) {
            legendBox = legend.getBox();
            legendDocked = legend.getDocked();

            me.legendRect = legendRect = Ext.Object.chain(shrinkRect);

            switch (legendDocked) {
                case 'right':
                    tilesRect.width -= legendBox.width;
                    legendRect.width = legendBox.width;

                    legendRect.x = rect.width - legendBox.width;
                    break;
                case 'left':
                    tilesRect.width -= legendBox.width;
                    legendRect.width = legendBox.width;

                    tilesRect.x += legendBox.width;
                    break;

                case 'bottom':
                    tilesRect.height -= legendBox.height;
                    legendRect.height = legendBox.height;

                    legendRect.y = rect.height - legendBox.height;
                    break;
                case 'top':
                    tilesRect.height -= legendBox.height;
                    legendRect.height = legendBox.height;

                    tilesRect.y += legendBox.height;
                    break;
            }

            Ext.d3.Helpers.alignRect('center', 'center', legendBox, legendRect, legend.getGroup());
        }

        xRange = [tilesRect.x, tilesRect.x + tilesRect.width];
        if (isRtl) {
            xRange.reverse();
        }
        xScale[isOrdinalX ? 'rangeBands' : 'range'](xRange);
        yScale[isOrdinalY ? 'rangeBands' : 'range']([tilesRect.y + tilesRect.height, tilesRect.y]);

        xAxisGroup.attr('transform', 'translate(0,' + (xD3Axis.orient() === 'top' ? tilesRect.y : (tilesRect.y + tilesRect.height)) + ')');
        yAxisGroup.attr('transform', 'translate(' + (yD3Axis.orient() === 'left' ? tilesRect.x : (tilesRect.x + tilesRect.width)) + ',0)');

        me.renderScene();
    },

    setupScene: function (scene) {
        var me = this;

        me.callParent([scene]);
        me.tilesGroup = scene.append('g').classed(me.defaultCls.tiles, true);
        // To avoid seeing heatmap components immidiately,
        // the scene is hidden until the first layout.
        me.hideScene();
    },

    getRenderedTiles: function () {
        return this.tilesGroup.selectAll('.' + this.defaultCls.tile);
    },

    renderScene: function (data) {
        var me = this,

            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),

            tiles;

        data = data || me.data || me.getStoreData(me.getStore());

        tiles = me.getRenderedTiles().data(data);

        me.onAddTiles(tiles.enter());
        me.onUpdateTiles(tiles);
        me.onRemoveTiles(tiles.exit());

        xAxis.render();
        yAxis.render();
    },

    onAddTiles: function (selection) {
        var me = this,
            tiles = me.getTiles(),
            labels = me.getLabels(),
            groups, rects, texts;

        if (selection.empty()) {
            return;
        }

        groups = selection.append('g')
            .classed(me.defaultCls.tile, true);
        rects = groups.append('rect');

        if (tiles) {
            rects.attr(tiles.attr);
            groups.classed(tiles.cls, !!tiles.cls);
            if (labels) {
                texts = groups.append('text');
                texts.attr(labels.attr);
                texts.classed(labels.cls, !!labels.cls);

                if (Ext.d3.Helpers.noDominantBaseline()) {
                    texts.each(function () {
                        Ext.d3.Helpers.fakeDominantBaseline(this, 'central', true);
                    });
                }
            }
        }
    },

    onUpdateTiles: function (selection) {
        var me = this,
            isRtl = me.getInherited().rtl,
            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),
            colorAxis = me.getColorAxis(),

            xScale = xAxis.getScale(),
            yScale = yAxis.getScale(),
            colorScale = colorAxis.getScale(),

            isOrdinalX = Ext.d3.Helpers.isOrdinalScale(xScale),
            isOrdinalY = Ext.d3.Helpers.isOrdinalScale(yScale),

            xBand = isOrdinalX ? xScale.rangeBand() : 0,
            yBand = isOrdinalY ? yScale.rangeBand() : 0,

            xField = xAxis.getField(),
            yField = yAxis.getField(),
            colorField = colorAxis.getField(),

            xStep = xAxis.getStep(),
            yStep = yAxis.getStep(),

            tileWidth = xBand || Math.abs(xScale(xStep) - xScale(0));

        selection.select('rect')
            .attr('x', function (item) {
                var x = xScale(item.data[xField]);

                if (isRtl) {
                    x -= isOrdinalX ? 0 : tileWidth;
                }
                return x;
            })
            .attr('y', function (item) {
                var value = item.data[yField];

                if (!isOrdinalY) {
                    value += yStep;
                }
                return yScale(value);
            })
            .attr('width', tileWidth)
            .attr('height',  yBand || yScale(0) - yScale(yStep))
            .style('fill', function (item) {
                return colorScale(item.data[colorField]);
            });

        selection.select('text')
            .attr('x', function (item) {
                var value = item.data[xField];
                if (!isOrdinalX) {
                    // `value` may be a Date object, so coerce it to number
                    value = +value + xStep / 2;
                }
                value = xScale(value);
                if (isOrdinalX) {
                    value += xBand / 2;
                }
                return value;
            })
            .attr('y', function (item) {
                var value = item.data[yField];
                if (!isOrdinalY) {
                    value = +value + yStep / 2;
                }
                value = yScale(value);
                if (isOrdinalY) {
                    value += yBand / 2;
                }
                return value;
            })
            .text(function (item) {
                return item.data[colorField];
            });
    },

    onRemoveTiles: function (selection) {
        selection.remove();
    },

    destroy: function () {
        var me = this,
            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),
            colorAxis = me.getColorAxis(),
            legend = me.getLegend();

        Ext.destroy(xAxis, yAxis, colorAxis, legend);

        me.callParent();
    }

});
