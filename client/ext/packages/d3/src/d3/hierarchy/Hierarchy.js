/**
 * Abstract class for D3 components using
 * [Hierarchy Layout](https://github.com/mbostock/d3/wiki/Hierarchy-Layout).
 * The Hierarchy component uses the root {@link Ext.data.TreeModel node} of a bound
 * {@link Ext.data.NodeStore node store} to compute positions of all nodes,
 * as well as objects representing the links from parent to child for each node.
 *
 * Several attributes are populated on each node:
 * - `parent` - the parent node, or null for the root.
 * - `children` - the array of child nodes, or null for leaf nodes.
 * - `value` - the node value, as returned by the value accessor.
 * - `depth` - the depth of the node, starting at 0 for the root.
 * - `x` - the minimum x-coordinate of the node position.
 * - `y` - the minimum y-coordinate of the node position.
 * - `dx` - the x-extent of the node position.
 * - `dy` - the y-extent of the node position.
 *
 * Each link is an object with two attributes:
 * - `source` - the parent node.
 * - `target` - the child node.
 *
 * The class also provides an ability to color code each node with the
 * {@link Ext.d3.axis.Color}.
 */
Ext.define('Ext.d3.hierarchy.Hierarchy', {
    extend: 'Ext.d3.svg.Svg',

    requires: [
        'Ext.d3.axis.Color',
        'Ext.d3.Helpers',
        'Ext.plugin.MouseEnter'
    ],

    mixins: [
        'Ext.d3.mixin.ToolTip'
    ],

    config: {
        /**
         * The class name added to all hieararchy components (subclasses).
         * See also {@link #componentCls}.
         * @cfg {String} hierarchyCls
         */
        hierarchyCls: 'hierarchy',

        /**
         * The selected model. Typically used with {@link #bind binding}.
         * @cfg {Ext.data.TreeModel} selection
         */
        selection: null,

        /**
         * A {@link Ext.d3.axis.Color} config or an instance.
         * By default (if no 'colorAxis' config is given) all nodes
         * are assigned a unique color from the `d3.scale.category20c`
         * scale (until the colors run out, then we start to reuse them)
         * based on the value of the `name` field.
         * @cfg {Ext.d3.axis.Color} colorAxis
         */
        colorAxis: {
            scale: {
                type: 'category20c'
            },
            field: 'name'
        },

        /**
         * [Children](https://github.com/mbostock/d3/wiki/Hierarchy-Layout#children)
         * accessor for the hierarchy layout.
         * Defaults to returning node's {@link Ext.data.NodeInterface#childNodes},
         * if the node is {@link Ext.data.NodeInterface#expanded} or null otherwise.
         * @cfg {Function} nodeChildren
         * @param {d3.layout.hierarchy} this A hierarchy family layout.
         * @param {Ext.data.TreeModel} node An instance of the TreeModel class.
         * @return {Ext.data.TreeModel[]}
         */
        nodeChildren: function (node) {
            return node.isExpanded() ? Ext.Array.slice(node.childNodes) : null;
        },

        /**
         * A function that updates class attributes of a given selection.
         * By default adds the following classes to node elements:
         * - `parent` - if a node has children.
         * - `expanded` - if a node is expanded.
         * - `root` - if a node is the root node.
         * - `{@link #nodeCls}` - at all times.
         * @cfg {Function} nodeClass
         * @param {d3.selection} selection
         */
        nodeClass: undefined,

        /**
         * A function that returns a text string, given a {@link Ext.data.TreeModel} instance.
         * Alternatively, can be a field name or an array of field names used to fetch the text.
         * If array of field names is given, the first non-empty string will be used.
         * @cfg {Function/String/String[]} nodeText
         * @param {Ext.d3.hierarchy.Hierarchy} component
         * @param {Ext.data.TreeModel} node
         * @return {String}
         */
        nodeText: ['name', 'text'],

        /**
         * @private
         * Normally, one should use the store's `sorters` config instead of this one.
         * The [comparator](https://github.com/mbostock/d3/wiki/Hierarchy-Layout#sort)
         * function that sets the sort order of sibling nodes for the layout.
         * Invoked for pairs of nodes.
         * @cfg {Function/Boolean} sorter
         * @param {Ext.data.TreeModel} nodeA
         * @param {Ext.data.TreeModel} nodeB
         * @return {Number}
         */
        sorter: null,

        /**
         * @private
         * The function that transforms (typically, positions) every node
         * in the given selection.
         * @cfg {Function} nodeTransform
         * @param {d3.selection} selection
         */
        nodeTransform: function (selection) {
            selection.attr('transform', function (node) {
                return 'translate(' + node.x + ',' + node.y + ')';
            });
        },

        /**
         * The [value](https://github.com/mbostock/d3/wiki/Treemap-Layout#value)
         * accessor function.
         * @cfg {String/Function/Number} [nodeValue=1]
         * The accessor function that returns the value of the node, the name of
         * a record field that contains that value or the number that will be used
         * for all nodes. Defaults to 1, meaning all nodes have the same value.
         * @param {Ext.data.TreeModel} node
         * @return {Number} Numeric value of the node used to calculate its area.
         */
        nodeValue: 1,

        /**
         * The [key](https://github.com/mbostock/d3/wiki/Selections#data)
         * function to create nodeByKeyValue array to lookup nodes in.
         * Returns the 'id' of a node by default.
         * @cfg {Function} nodeKey
         * @param {Ext.data.TreeModel} node
         * @param {Number} index
         */
        nodeKey: function (node, index) {
            return node.id;
        },

        /**
         * The select event(s) to listen for on each node.
         * The node in question will be selected,
         * selection will be removed from the previously selected node.
         * The select event won't be handled when Ctrl/Cmd is pressed.
         * For example, this allows to expand a node by double-clicking
         * without selecting it.
         * @cfg {String/String[]} [selectEventName='click']
         */
        selectEventName: 'click',

        /**
         * The expand event(s) to listen for on each node.
         * The node in question will be expanded, if collapsed,
         * or collapsed, if expanded.
         * @cfg {String/String[]} [expandEventName='dblclick']
         */
        expandEventName: 'dblclick',

        /**
         * @cfg {Boolean} [rootVisible=true]
         * False to hide the root node.
         */
        rootVisible: true,

        /**
         * @protected
         * Subclasses are expected to create and return the layout inside `applyLayout`.
         */
        layout: undefined,

        /**
         * @private
         * If `true`, layout will be performed on data change
         * even if component has no size yet.
         */
        noSizeLayout: true,

        /**
         * @private
         */
        renderLinks: false
    },

    publishes: 'selection',

    root: null, // The root node of the store.
    /**
     * @private
     * Cached results of the most recent hierarchy layout.
     */
    nodes: null, // layout.nodes result
    links: null, // layout.links result

    defaultCls: {
        links: Ext.baseCSSPrefix + 'd3-links',
        nodes: Ext.baseCSSPrefix + 'd3-nodes',
        link: Ext.baseCSSPrefix + 'd3-link',
        node: Ext.baseCSSPrefix + 'd3-node',
        root: Ext.baseCSSPrefix + 'd3-root',
        label: Ext.baseCSSPrefix + 'd3-label',
        parent: Ext.baseCSSPrefix + 'd3-parent',
        leaf: Ext.baseCSSPrefix + 'd3-leaf',
        selected: Ext.baseCSSPrefix + 'd3-selected',
        expanded: Ext.baseCSSPrefix + 'd3-expanded'
    },

    /**
     * @private
     * Cached config used by default {@link #defaultNodeClass} as a parameter for
     * [selection.classed](https://github.com/mbostock/d3/wiki/Selections#classed)
     * method. For example:
     *
     *     {
     *         expanded: function (node) { return node.isExpanded(); },
     *         root: function (node) { return node.isRoo(); },
     *     }
     */
    nodeClassCfg: null,

    constructor: function (config) {
        this.callParent([config]);
        this.addNodeListeners();
        this.mixins.d3tooltip.constructor.call(this, config);
    },

    applyTooltip: function (tooltip, oldTooltip) {
        if (tooltip) {
            tooltip.delegate = 'g.' + this.defaultCls.node;
        }
        return this.mixins.d3tooltip.applyTooltip.call(this, tooltip, oldTooltip);
    },

    updateTooltip: null, // Override the updater in Modern component.

    defaultNodeClass: function (selection) {
        var me = this,
            cls = me.defaultCls,
            config = me.nodeClassCfg;

        if (!config) {
            me.nodeClassCfg = config = {};
            config[cls.parent] = function (node) {
                return !node.isLeaf();
            };
            config[cls.leaf] = function (node) {
                return node.isLeaf();
            };
            config[cls.expanded] = function (node) {
                return node.isExpanded();
            };
            config[cls.root] = function (node) {
                return node.isRoot();
            };
        }

        selection.classed(config);
    },

    transitionApplier: function (config, name) {
        if (config === true) {
            config = {};
        }
        if (Ext.isObject(config)) {
            config = Ext.mergeIf(config, this.transitionDefaults[name]);
        } else {
            config = Boolean(config);
        }
        return config;
    },

    applyColorAxis: function (colorAxis, oldColorAxis) {
        if (colorAxis && !colorAxis.isColorAxis) {
            colorAxis = new Ext.d3.axis.Color(colorAxis);
        }
        return colorAxis || oldColorAxis;
    },

    applyNodeText: function (nodeText) {
        var fn;

        if (typeof nodeText === 'function') {
            fn = nodeText;
        } else if (typeof nodeText === 'string') {
            fn = function (component, node) {
                var data = node && node.data;
                return data && data[nodeText] || '';
            };
        } else if (Array.isArray(nodeText)) {
            fn = function (component, node) {
                var data = node && node.data,
                    text, i;

                if (data) {
                    for (i = 0; i < nodeText.length && !text; i++) {
                        text = data[nodeText[i]];
                    }
                }
                
                return text || '';
            };
        }
        //<debug>
        else {
            Ext.raise('nodeText must be a string, array of strings, or a function that returns a string.');
        }
        //</debug>

        return fn;
    },

    applyNodeClass: function (nodeClass, oldNodeClass) {
        var result;

        if (Ext.isFunction(nodeClass)) {
            result = nodeClass;
        } else if (oldNodeClass) {
            result = oldNodeClass;
        } else {
            result = this.defaultNodeClass;
        }

        return result;
    },

    updateHierarchyCls: function (hierarchyCls, oldHierarchyCls) {
        var baseCls = this.getBaseCls(),
            el = this.element;

        if (hierarchyCls && Ext.isString(hierarchyCls)) {
            el.addCls(hierarchyCls, baseCls);
            if (oldHierarchyCls) {
                el.removeCls(oldHierarchyCls, baseCls);
            }
        }
    },

    applyStore: function (store, oldStore) {
        var result = this.callParent([store, oldStore]);

        if (result && !result.isTreeStore) {
            Ext.raise('The store must be a Ext.data.TreeStore.');
        }

        return result;
    },

    updateSorter: function (sorter) {
        var layout = this.getLayout();

        if (typeof sorter === 'function') {
            layout.sort(sorter);
        } else if (sorter === false) {
            // From D3 docs: "A null comparator disables sorting and uses tree traversal order."
            // However, a null config value won't trigger the applier/updater, which means:
            // "If comparator is not specified, returns the current group sort order,
            // which defaults to ascending order by the associated input data's numeric
            // `value` attribute."
            layout.sort(null);
        }
    },

    applyNodeValue: function (nodeValue) {
        var result;

        if (typeof nodeValue === 'string') {
            result = function (node) {
                return node.data[nodeValue];
            };
        } else if (Ext.isNumber(nodeValue)) {
            result = function () {
                return nodeValue;
            };
        } else if (typeof nodeValue === 'function') {
            result = nodeValue;
        }

        return result;
    },

    updateNodeValue: function (nodeValue) {
        var layout = this.getLayout();

        layout.value(nodeValue);
    },

    /**
     * @private
     * Looks up `node` in the given `selection` by node's ID and returns node's element,
     * as a D3 selection. Notes:
     * - `selection` should have DOM elements bound (should consist of rendered nodes);
     * - the returned selection can be empty, if the node wasn't found; `selection.empty()`
     *   can be used to check this;
     * - in most cases using the {@link #selectNode} method is preferable, as it is faster;
     *   however this method will find the node's element even if the enter selection
     *   was not passed to the `onNodesAdd` method.
     * @param {Ext.data.TreeModel} node
     * @param {d3.selection} [selection] Defaults to all rendered nodes, if omitted.
     * @return {d3.selection} Node's element, as a D3 selection.
     */
    findNode: function (node, selection) {
        selection = selection || this.getRenderedNodes();

        return selection.filter(function (d) {
            return node && (d.id === node.id || d === node);
        });
    },

    /**
     * Selects the given tree `node` by ID and returns it as a D3 selection.
     * The returned selection can be empty, if the given `node` doesn't have a DOM representation.
     * Notes: not to be confused with the `selection` config and the corresponding `setSelection`
     * method, which highlight the given tree node in the rendered image.
     * @param {Ext.data.TreeModel} node
     * @return {d3.selection}
     */
    selectNode: function (node) {
        return d3.select(node ? '[data-id="' + node.id + '"]' : null);
    },

    /**
     * @private
     * Checks if the node belongs to the component's store.
     * @param {Ext.data.TreeModel} node
     * @return {Boolean}
     */
    isNodeInStore: function (node) {
        var store = this.getStore();

        return !!(node && store && !store.isEmptyStore && (
            node.store === store || store.getNodeById(node.id) === node || store.getRoot() === node
        ));
    },

    applySelection: function (node) {
        return this.isNodeInStore(node) ? node : null;
    },

    updateSelection: function (node, oldNode) {
        var me = this;

        if (!me.hasFirstRender) {
            if (node) {
                me.on({
                    scenerender: me.updateSelection.bind(me, node, oldNode),
                    single: true
                });
            }
            return;
        }

        var el, oldEl, hasElement;

        if (node) {
            el = me.selectNode(node);
            hasElement = !el.empty();
            if (hasElement) {
                me.onNodeSelect(node, el);
            } else {
                // Set the value of the config to `null` here, as for the applier to return
                // `null` in this case, it should perform the element check as well.
                // If the check is performed in the applier, we still cannot remove it here,
                // because we need to call `selectNode` anyway to get the element.
                me[me.self.getConfigurator().configs.selection.names.internal] = null;
                Ext.log.warn('Selected node "' + node.id +
                    '" does not have an associated element. E.g.:\n' +
                    '- node was selected before it was rendered;\n' +
                    '- node was selected in some other view, but is not supposed ' +
                    'to be rendered by D3 component (see "nodeChildren" config).');
            }
        }

        if (oldNode) {
            oldEl = me.selectNode(oldNode);
            if (!oldEl.empty()) {
                me.onNodeDeselect(oldNode, oldEl);
            }
        }

        if (hasElement) {
            me.fireEvent('selectionchange', me, node, oldNode);
        }
    },

    /**
     * @protected
     * @param {Ext.data.TreeModel} node
     * @param {d3.selection} element
     */
    onNodeSelect: function (node, element) {
        element.classed(this.defaultCls.selected, true);
        this.fireEvent('select', this, node, element);
    },

    /**
     * @protected
     * @param {Ext.data.TreeModel} node
     * @param {d3.selection} element
     */
    onNodeDeselect: function (node, el) {
        el.classed(this.defaultCls.selected, false);
        this.fireEvent('deselect', this, node, el);
    },

    /**
     * @protected
     * All nodes that are added to the scene by the {@link #addNodes} method
     * are expected to be passed to this method (as a D3 selection).
     * @param {d3.selection} selection
     */
    onNodesAdd: function (selection) {
        var me = this,
            nodeClass = me.getNodeClass();

        selection
            .call(nodeClass.bind(me))
            // Have to add listeners Ext way to get event normalization:
            // https://docs.sencha.com/extjs/6.0/core_concepts/events.html#Event_Normalization
            .each(function (node) {
                // A node doesn't store a reference to the associated DOM element
                // (if any), unlike the element, which does store a reference
                // to the associated datum (node) in the __data__ property.
                // To make finding corresponding DOM elements easier,
                // 'data-id' of the node's group element will correspond to the ID
                // of the tree node. See the `selectNode` method for example.
                this.setAttribute('data-id', node.id);
            });
    },

    /**
     * @protected
     * Adds delegated listeners to handle pointer events for all child nodes
     */
    addNodeListeners: function () {
        var me = this,
            selectEventName = Ext.Array.from(me.getSelectEventName()),
            expandEventName = Ext.Array.from(me.getExpandEventName()),
            i, len, eventName;

        for (i = 0, len = selectEventName.length; i < len; i++) {
            me.addNodeListener(selectEventName[i], me.onSelectEvent);
        }
        for (i = 0, len = expandEventName.length; i < len; i++) {
            me.addNodeListener(expandEventName[i], me.onExpandEvent);
        }
    },

    addNodeListener: function(eventName, handler) {
        var me = this,
            targetEl = Ext.get(me.getScene().node());

        if (eventName === 'mouseenter') {
            me.addPlugin({
                type: 'mouseenter',
                element: targetEl,
                delegate: 'g.' + me.defaultCls.node,
                handler: handler
            });
        } else {
            targetEl.on(eventName, handler, me, {
                delegate: 'g.' + me.defaultCls.node
            });
        }
    },

    onSelectEvent: function (event, target) {
        // Fetching the 'node' and 'element' this way is not exactly pretty,
        // but arguably better than capturing 'addNodeListeners' arguments
        // in a closure for every element listener.
        var selection = d3.select(target),
            element = selection.node(),
            node = selection.datum();

        this.handleSelectEvent(event, node, element);
    },

    handleSelectEvent: function (event, node, element) {
        this.setSelection(node);
    },

    onExpandEvent: function (event) {
        var selection = d3.select(event.currentTarget),
            element = selection.node(),
            node = selection.datum();

        this.handleExpandEvent(event, node, element);
    },

    handleExpandEvent: function (event, node, element) {
        if (node.isExpanded()) {
            node.collapse();
        } else {
            node.expand();
        }
    },

    updateNodeChildren: function (nodeChildren) {
        var layout = this.getLayout();

        layout.children(nodeChildren);
    },

    /**
     * @protected
     * Sets the size of a hierarchy layout via its 'size' method.
     * @param {Number[]} size The size of the scene.
     */
    setLayoutSize: function (size) {
        var layout = this.getLayout();

        layout.size(size);
    },

    getLayoutSize: function () {
        var layout = this.getLayout(),
            size = layout.size && layout.size();

        return size;
    },

    onSceneResize: function (scene, rect) {
        this.callParent([scene, rect]);
        this.setLayoutSize([rect.width, rect.height]);
        this.performLayout();
    },

    hasFirstLayout: false,
    hasFirstRender: false,

    /**
     * @private
     */
    isLayoutBlocked: Ext.emptyFn,

    /**
     * Uses bound store records to calculate the layout of nodes and links
     * and re-renders the scene.
     */
    performLayout: function () {
        var me = this,
            store = me.getStore(),
            root = store && store.getRoot(),
            renderLinks = me.getRenderLinks(),
            layout = me.getLayout(),
            nodes, links;

        if (!root || me.isInitializing || me.isLayoutBlocked(layout)) {
            return;
        }

        // Make sure we have the scene created and set up.
        me.getScene();

        nodes = me.nodes = layout(root);
        if (renderLinks) {
            links = me.links = layout.links(nodes);
        }

        me.hasFirstLayout = true;

        me.renderScene(nodes, links);
    },

    processDataChange: function (store) {
        if (this.getNoSizeLayout() || this.size) {
            this.performLayout();
        }
    },

    setupScene: function (scene) {
        var me = this;

        me.callParent([scene]);

        // Links should render before nodes.
        // A node is rendered at a certain coordinate, which is typically
        // the center of a node, and so a link is a connection between
        // the centers of a pair of nodes. Usually, we want it to appear
        // as if a link goes edge to edge, not center to center.

        // However, this alone is not enough, because if a node itself is not
        // updated, e.g. it's already visible and we simply show its children,
        // the links will still be painted on top. Because SVG has no z-index and
        // the elements are rendered in the order in which they appear in the document,
        // the nodes have to be either sorted or placed in pre-sorted groups. We do
        // the latter here.

        me.linksGroup = scene.append('g').classed(me.defaultCls.links, true);
        me.nodesGroup = scene.append('g').classed(me.defaultCls.nodes, true);
    },

    getRenderedNodes: function () {
        return this.nodesGroup.selectAll('.' + this.defaultCls.node);
    },

    getRenderedLinks: function () {
        return this.linksGroup.selectAll('.' + this.defaultCls.link);
    },

    /**
     * Renders arrays of nodes and links, returned by
     * [hierarchy(root)](https://github.com/mbostock/d3/wiki/Hierarchy-Layout#_hierarchy)
     * and [hierarchy.links(nodes)](https://github.com/mbostock/d3/wiki/Hierarchy-Layout#links)
     * methods.
     * Both `nodes` and `links` arguments are optional and, if not specified,
     * the method re-renders nodes/links produced by the most recent layout.
     * @param {Array} [nodes]
     * @param {Array} [links]
     */
    renderScene: function (nodes, links) {
        var me = this,
            nodeKey = me.getNodeKey(),
            rootVisible = me.getRootVisible(),
            linkElements,
            nodeElements;

        if (!me.hasFirstLayout) {
            me.performLayout();
        }

        // If several D3 components are using the same store,
        // updates can be slow. If some of the components are not visible,
        // it may not be obvious why updates are slow.

        nodes = nodes || me.nodes;
        links = links || me.links;

        if (nodes) {
            nodeElements = me.getRenderedNodes().data(nodes, nodeKey);
            me.renderNodes(nodeElements);
            if (links) {
                linkElements = me.getRenderedLinks().data(links);
                me.renderLinks(linkElements);
            }
        }

        me.nodesGroup.select('.' + me.defaultCls.root)
            .classed(me.defaultCls.hidden, !rootVisible);

        me.hasFirstRender = true;

        me.onAfterRender(nodeElements, linkElements);
        me.fireEvent('scenerender', me, nodeElements, linkElements);
    },

    renderLinks: function (linkElements) {
        this.addLinks(linkElements.enter());
        this.updateLinks(linkElements);
        this.removeLinks(linkElements.exit());
    },

    renderNodes: function (nodeElements) {
        this.addNodes(nodeElements.enter());
        this.updateNodes(nodeElements);
        this.removeNodes(nodeElements.exit());
    },

    /**
     * @private
     */
    onAfterRender: Ext.emptyFn,

    updateLinks: Ext.emptyFn,
    addLinks: Ext.emptyFn,

    updateNodes: Ext.emptyFn,
    addNodes: Ext.emptyFn,

    removeLinks: function (selection) {
        selection.remove();
    },

    removeNodes: function (selection) {
        selection.remove();
    }

});
