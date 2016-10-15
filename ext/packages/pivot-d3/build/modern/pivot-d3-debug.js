/**
 * This component extends the D3 HeatMap to work with a pivot matrix.
 *
 * Basically this component needs a pivot matrix to be configured. The values
 * calculated by the pivot matrix are distributed as following:
 *
 *  - `leftAxis` maps to HeatMap `xAxis`
 *  - `topAxis` maps to HeatMap `yAxis`
 *  - `aggregate` maps to HeatMap `colorAxis`
 *
 * The pivot matrix should be configured with maximum one dimension per
 * `leftAxis`, `topAxis` or `aggregate`.
 *
 */
Ext.define('Ext.pivot.d3.HeatMap', {
    extend: 'Ext.d3.HeatMap',
    xtype: 'pivotheatmap',
    requires: [
        'Ext.pivot.matrix.Local',
        'Ext.pivot.matrix.Remote'
    ],
    padding: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 80
    },
    config: {
        /**
         * @cfg {String} defaultFormatter
         *
         * Default formatter used to render cells on colorAxis
         */
        defaultFormatter: 'number("0.00")',
        /**
         * @cfg {Ext.pivot.matrix.Base} matrix
         *
         * Pivot matrix specific configuration
         */
        matrix: {
            type: 'local',
            rowGrandTotalsPosition: 'none',
            colGrandTotalsPosition: 'none'
        },
        xAxis: {
            axis: {
                orient: 'bottom'
            },
            scale: {
                type: 'ordinal'
            },
            step: 100
        },
        yAxis: {
            axis: {
                orient: 'left'
            },
            scale: {
                type: 'ordinal'
            },
            step: 100
        },
        colorAxis: {
            scale: {
                type: 'linear',
                range: [
                    'white',
                    'green'
                ]
            }
        },
        tiles: {
            attr: {
                'stroke': 'green',
                'stroke-width': 1
            },
            labels: true
        },
        legend: {
            docked: 'bottom',
            padding: 60,
            items: {
                count: 10,
                slice: [
                    1
                ],
                size: {
                    x: 40,
                    y: 20
                }
            }
        }
    },
    destroy: function() {
        this.setMatrix(null);
        this.callParent();
    },
    applyMatrix: function(matrix) {
        if (matrix) {
            if (!matrix.isPivotMatrix) {
                if (!matrix.type) {
                    matrix.type = 'local';
                }
                matrix.cmp = this;
                matrix = Ext.Factory.pivotmatrix(matrix);
            }
        }
        return matrix;
    },
    updateMatrix: function(matrix, oldMatrix) {
        var me = this;
        Ext.destroy(oldMatrix, me.matrixListeners);
        me.matrixListeners = null;
        if (matrix) {
            me.matrixListeners = matrix.on({
                done: me.onMatrixDataReady,
                scope: me,
                destroyable: true
            });
        }
    },
    updateStore: Ext.emptyFn,
    updateXAxis: Ext.emptyFn,
    updateYAxis: Ext.emptyFn,
    updateColorAxis: Ext.emptyFn,
    onMatrixDataReady: function(matrix) {
        //let's configure the heatmap widget axis
        var me = this,
            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),
            zAxis = me.getColorAxis(),
            xDim = matrix.leftAxis.dimensions,
            yDim = matrix.topAxis.dimensions,
            zDim = matrix.aggregate,
            dim;
        if (xDim.getCount() && xAxis) {
            dim = xDim.getAt(0);
            xAxis.setField(dim.getDataIndex());
            xAxis.setTitle({
                text: dim.getHeader()
            });
        }
        if (yDim.getCount() && yAxis) {
            dim = yDim.getAt(0);
            yAxis.setField(dim.getDataIndex());
            yAxis.setTitle({
                text: dim.getHeader()
            });
        }
        if (zDim.getCount() && zAxis) {
            dim = zDim.getAt(0);
            zAxis.setField(dim.getId());
        }
        this.processData();
        this.performLayout();
    },
    bindFormatter: function(format, scope) {
        var me = this;
        return function(v) {
            return format(v, scope || me.resolveListenerScope());
        };
    },
    getStoreData: function() {
        var me = this,
            matrix = me.getMatrix(),
            leftItems = matrix.leftAxis.getTree(),
            lenLeft = leftItems.length,
            topItems = matrix.topAxis.getTree(),
            lenTop = topItems.length,
            items = [],
            xAxis = me.getXAxis(),
            yAxis = me.getYAxis(),
            colorAxis = me.getColorAxis(),
            xField = xAxis.getField(),
            yField = yAxis.getField(),
            zField = colorAxis.getField(),
            i, j, leftItem, topItem, result, obj, value;
        for (i = 0; i < lenLeft; i++) {
            leftItem = leftItems[i];
            for (j = 0; j < lenTop; j++) {
                topItem = topItems[j];
                result = matrix.results.get(leftItem.key, topItem.key);
                obj = {
                    data: {}
                };
                obj.data[xField] = leftItem.name;
                obj.data[yField] = topItem.name;
                obj.data[zField] = result ? result.getValue(zField) : null;
                obj.data['records'] = result ? result.records.length : 0;
                items.push(obj);
            }
        }
        return items;
    },
    onUpdateTiles: function(selection) {
        var me = this,
            matrix = me.getMatrix(),
            colorField = me.getColorAxis().getField(),
            dimension, formatter, scope, parser;
        if (matrix.aggregate.getCount()) {
            dimension = matrix.aggregate.getAt(0);
            formatter = dimension.getFormatter() || me.getDefaultFormatter();
            scope = dimension.getScope();
            parser = Ext.app.bind.Parser.fly(formatter);
            formatter = me.bindFormatter(parser.compileFormat(), scope);
            parser.release();
        }
        me.callParent([
            selection
        ]);
        selection.select('text').text(function(item) {
            var v = item.data[colorField] || null;
            if (v !== null && dimension && formatter) {
                v = formatter(v);
            }
            return v !== null ? v : null;
        });
    }
});

/**
 * This container can host D3 drawing components that need a pivot configurator
 * plugin.
 */
Ext.define('Ext.pivot.d3.AbstractContainer', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.pivot.d3.HeatMap',
        'Ext.pivot.plugin.Configurator'
    ],
    // this makes the pivot configurator plugin work with this container
    isPivotComponent: true,
    config: {
        /**
         * @cfg {Ext.pivot.matrix.Base} matrix (required)
         *
         * This is the pivot matrix used by the pivot D3 container. All axis and aggregate dimensions should
         * be defined here.
         *
         * Needed by this pivot container so that the configurator plugin can call getMatrix.
         *
         * This matrix is also used by the {@link #drawing}.
         */
        matrix: {
            type: 'local'
        },
        /**
         * @cfg {Ext.Component} drawing
         *
         * Configuration object for the item that will be added to this container
         */
        drawing: {
            xtype: 'pivotheatmap'
        },
        /**
         * @cfg {Ext.pivot.plugin.Configurator} configurator
         *
         * Configuration object for the pivot Configurator plugin.
         */
        configurator: null
    },
    destroy: function() {
        this.setMatrix(null);
        this.callParent();
    },
    addDrawing: function() {
        this.add(Ext.applyIf({
            matrix: this.getMatrix()
        }, this.getDrawing()));
    },
    applyMatrix: function(newMatrix, oldMatrix) {
        Ext.destroy(oldMatrix);
        if (newMatrix == null) {
            return newMatrix;
        }
        if (newMatrix && newMatrix.isPivotMatrix) {
            newMatrix.cmp = this;
            return newMatrix;
        }
        Ext.applyIf(newMatrix, {
            type: 'local'
        });
        newMatrix.cmp = this;
        return Ext.Factory.pivotmatrix(newMatrix);
    },
    applyConfigurator: function(plugin) {
        return plugin ? this.addPlugin(plugin) : null;
    },
    updateConfigurator: function(plugin, oldPlugin) {
        if (oldPlugin) {
            this.removePlugin(oldPlugin);
        }
    }
});

/**
 * This component extends the D3 TreeMap to work with a pivot matrix.
 *
 * Basically this component needs a pivot matrix to be configured. The values
 * calculated by the pivot matrix are distributed as following:
 *
 *  - `leftAxis` maps to TreeMap `colorAxis`
 *  - `aggregate` maps to TreeMap `nodeValue`
 *
 * Multiple dimensions can be configured on `leftAxis` but only one dimension
 * on the `aggregate`. `topAxis` dimensions are ignored.
 *
 */
Ext.define('Ext.pivot.d3.TreeMap', {
    extend: 'Ext.d3.hierarchy.TreeMap',
    xtype: 'pivottreemap',
    requires: [
        'Ext.pivot.matrix.Local',
        'Ext.pivot.matrix.Remote'
    ],
    config: {
        /**
         * @cfg {Boolean} autoExpand
         *
         * Should the generated tree items be expanded by default?
         */
        autoExpand: true,
        /**
         * @cfg {Ext.pivot.matrix.Base} matrix
         *
         * Pivot matrix specific configuration
         */
        matrix: {
            type: 'local',
            rowGrandTotalsPosition: 'none',
            colGrandTotalsPosition: 'none'
        },
        store: {
            type: 'tree',
            fields: [
                'name',
                'value',
                {
                    name: 'records',
                    type: 'int'
                }
            ],
            root: {
                expanded: true,
                name: 'Root',
                children: []
            }
        },
        nodeValue: function(node) {
            return node.data.value;
        },
        colorAxis: {
            scale: {
                type: 'linear',
                domain: [
                    -5,
                    0,
                    5
                ],
                range: [
                    '#E45649',
                    '#ECECEC',
                    '#50A14F'
                ]
            },
            processor: function(axis, scale, node, field) {
                return node.isLeaf() ? scale(node.data.depth - 5) : '#ececec';
            }
        }
    },
    destroy: function() {
        this.setMatrix(null);
        this.callParent();
    },
    applyMatrix: function(matrix) {
        if (matrix) {
            if (!matrix.isPivotMatrix) {
                if (!matrix.type) {
                    matrix.type = 'local';
                }
                matrix.cmp = this;
                matrix = Ext.Factory.pivotmatrix(matrix);
            }
        }
        return matrix;
    },
    updateMatrix: function(matrix, oldMatrix) {
        var me = this;
        Ext.destroy(oldMatrix, me.matrixListeners);
        me.matrixListeners = null;
        if (matrix) {
            me.matrixListeners = matrix.on({
                done: me.onMatrixDataReady,
                scope: me,
                destroyable: true
            });
        }
    },
    onMatrixDataReady: function(matrix) {
        //let's configure the treemap widget axis
        var me = this,
            zAxis = me.getColorAxis(),
            zDim = matrix.aggregate,
            root = me.getStore().getRoot(),
            dim;
        if (zDim.getCount() && zAxis) {
            dim = zDim.getAt(0).getId();
            zAxis.setField(dim);
        }
        // let's update the data in the tree store
        var data = me.getTreeStoreData(matrix.leftAxis.getTree(), dim);
        if (root) {
            root.removeAll();
            root.appendChild(data);
        }
        me.performLayout();
    },
    getTreeStoreData: function(tree, field) {
        var ret = [],
            matrix = this.getMatrix(),
            expanded = this.getAutoExpand(),
            i, len, item, obj, result;
        if (tree && matrix) {
            len = tree.length;
            for (i = 0; i < len; i++) {
                item = tree[i];
                result = matrix.results.get(item.key, matrix.grandTotalKey);
                if (result) {
                    obj = {
                        path: item.key,
                        name: item.name,
                        value: result ? result.getValue(field) : null,
                        records: result ? result.records.length : 0
                    };
                    if (item.children) {
                        obj.children = this.getTreeStoreData(item.children, field);
                        obj.expanded = expanded;
                    } else {
                        obj.leaf = true;
                    }
                    ret.push(obj);
                }
            }
        }
        return ret;
    }
});

/**
 * This container can host D3 components that need a pivot configurator
 * plugin.
 */
Ext.define('Ext.pivot.d3.Container', {
    extend: 'Ext.pivot.d3.AbstractContainer',
    xtype: 'pivotd3container',
    config: {
        configurator: {
            id: 'configurator',
            type: 'pivotconfigurator'
        }
    },
    initialize: function() {
        this.addDrawing();
        this.callParent();
    }
});

