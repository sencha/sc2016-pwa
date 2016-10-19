/**
 * This class implements the form that allows changing the field settings.
 */
Ext.define('Ext.pivot.plugin.configurator.Form', {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.pivot.plugin.configurator.store.Select',
        'Ext.pivot.plugin.configurator.FormController',
        'Ext.form.FieldSet',
        'Ext.field.Toggle',
        'Ext.field.Select',
        'Ext.field.Radio',
        'Ext.field.Text',
        'Ext.field.Hidden',
        'Ext.layout.VBox',
        'Ext.layout.HBox',
        'Ext.TitleBar'
    ],

    xtype: 'pivotconfigform',
    controller: 'pivotconfigform',
    viewModel: {
        stores: {
            sFormatters: {
                type: 'pivotselect'
            },
            sAggregators: {
                type: 'pivotselect'
            },
            sSorters: {
                type: 'pivotselect'
            },
            sFilters: {
                type: 'pivotselect'
            },
            sOperators: {
                type: 'pivotselect'
            },
            sTopOrder: {
                type: 'pivotselect'
            },
            sTopType: {
                type: 'pivotselect'
            },
            sDimensions: {
                type: 'pivotselect'
            },
            sAlign: {
                type: 'pivotselect'
            }
        }
    },

    eventedConfig: {
        fieldItem: null,
        title: null
    },

    listeners: {
        fielditemchange: 'onFieldItemChanged'
    },

    defaults: {
        xtype:      'fieldset',
        defaults: {
            labelAlign: 'top'
        }
    },

    showAnimation: {
        type: 'slideIn',
        duration: 250,
        easing: 'ease-out',
        direction: 'left'
    },

    /**
     * @cfg
     * @inheritdoc
     */
    hideAnimation: {
        type: 'slideOut',
        duration: 250,
        easing: 'ease-in',
        direction: 'right'
    },

    okText:                     'Ok',
    cancelText:                 'Cancel',
    formatText:                 'Format as',
    summarizeByText:            'Summarize by',
    customNameText:             'Custom name',
    sourceNameText:             'The source name for this field is "{form.dataIndex}"',
    sortText:                   'Sort',
    filterText:                 'Filter',
    sortResultsText:            'Sort results',
    alignText:                  'Align',
    alignLeftText:              'Left',
    alignCenterText:            'Center',
    alignRightText:             'Right',

    caseSensitiveText:          'Case sensitive',
    valueText:                  'Value',
    fromText:                   'From',
    toText:                     'To',
    labelFilterText:            'Show items for which the label',
    valueFilterText:            'Show items for which',
    top10FilterText:            'Show',

    sortAscText:                'Sort A to Z',
    sortDescText:               'Sort Z to A',
    sortClearText:              'Disable sorting',
    clearFilterText:            'Disable filtering',
    labelFiltersText:           'Label filters',
    valueFiltersText:           'Value filters',
    top10FiltersText:           'Top 10 filters',

    equalsLText:                'equals',
    doesNotEqualLText:          'does not equal',
    beginsWithLText:            'begins with',
    doesNotBeginWithLText:      'does not begin with',
    endsWithLText:              'ends with',
    doesNotEndWithLText:        'does not end with',
    containsLText:              'contains',
    doesNotContainLText:        'does not contain',
    greaterThanLText:           'is greater than',
    greaterThanOrEqualToLText:  'is greater than or equal to',
    lessThanLText:              'is less than',
    lessThanOrEqualToLText:     'is less than or equal to',
    betweenLText:               'is between',
    notBetweenLText:            'is not between',
    topOrderTopText:            'Top',
    topOrderBottomText:         'Bottom',
    topTypeItemsText:           'Items',
    topTypePercentText:         'Percent',
    topTypeSumText:             'Sum',

    updateFieldItem: function(item){
        var me = this,
            items, field;

        me.removeAll(true, true);
        if(!item){
            return;
        }

        field = item.getField();
        items = [{
            xtype:      'titlebar',
            docked:     'top',
            titleAlign: 'left',
            bind: {
                title: '{form.header}'
            },
            items: [{
                text:   me.cancelText,
                align:  'right',
                ui:     'decline',
                handler:'cancelSettings'
            },{
                text:   me.okText,
                align:  'right',
                ui:     'confirm',
                handler:'applySettings',
                margin: '0 0 0 5'
            }]
        },{
            bind: {
                instructions: me.sourceNameText
            },
            items: [{
                label:      me.customNameText,
                xtype:      'textfield',
                name:       'header',
                bind:       '{form.header}'
            }]
        }];

        if(field.isAggregate){
            items.push({
                items: [{
                    label:          me.alignText,
                    xtype:          'selectfield',
                    autoSelect:     false,
                    useClearIcon:   true,
                    name:           'align',
                    bind: {
                        store:      '{sAlign}',
                        value:      '{form.align}'
                    }
                },{
                    label:          me.formatText,
                    xtype:          'selectfield',
                    autoSelect:     false,
                    useClearIcon:   true,
                    name:           'formatter',
                    bind: {
                        store:      '{sFormatters}',
                        value:      '{form.formatter}'
                    }
                },{
                    label:          me.summarizeByText,
                    xtype:          'selectfield',
                    autoSelect:     false,
                    useClearIcon:   true,
                    name:           'aggregator',
                    bind: {
                        store:      '{sAggregators}',
                        value:      '{form.aggregator}'
                    }
                }]
            });
        }else{
            items.push({
                xtype:      'fieldset',
                items: [{
                    label:          me.sortText,
                    labelAlign:     'top',
                    xtype:          'selectfield',
                    autoSelect:     false,
                    useClearIcon:   true,
                    name:           'sort',
                    bind: {
                        store:      '{sSorters}',
                        value:      '{form.direction}'
                    }
                },{
                    label:          me.filterText,
                    labelAlign:     'top',
                    xtype:          'selectfield',
                    autoSelect:     false,
                    useClearIcon:   true,
                    name:           'filter',
                    bind: {
                        store:      '{sFilters}',
                        value:      '{form.filter.type}'
                    },
                    listeners: {
                        change: 'onChangeFilterType'
                    }
                }]
            },{
                itemId:         'commonFilters',
                hidden:         true,
                title:          me.labelFilterText,
                defaults: {
                    labelAlign: 'top'
                },
                items: [{
                    role:           'dimensions',
                    xtype:          'selectfield',
                    autoSelect:     false,
                    name:           'dimensionId',
                    bind: {
                        store:      '{sDimensions}',
                        value:      '{form.filter.dimensionId}'
                    }
                },{
                    xtype:          'selectfield',
                    autoSelect:     false,
                    name:           'operator',
                    bind: {
                        store:      '{sOperators}',
                        value:      '{form.filter.operator}'
                    },
                    listeners: {
                        change:     'onChangeFilterOperator'
                    }
                },{
                    role:           'operator',
                    xtype:          'textfield',
                    placeHolder:    me.valueText,
                    name:           'value',
                    bind:           '{form.filter.value}'
                },{
                    role:           'between',
                    xtype:          'textfield',
                    placeHolder:    me.fromText,
                    hidden:         true,
                    name:           'from',
                    bind:           '{form.filter.from}'
                },{
                    role:           'between',
                    xtype:          'textfield',
                    placeHolder:    me.toText,
                    hidden:         true,
                    name:           'to',
                    bind:           '{form.filter.to}'
                },{
                    xtype:          'togglefield',
                    label:          me.caseSensitiveText,
                    name:           'caseSensitive',
                    bind:           '{form.filter.caseSensitive}'
                }]
            },{
                itemId:         'top10Filters',
                xtype:          'fieldset',
                hidden:         true,
                title:          me.top10FilterText,
                defaults: {
                    labelAlign: 'top'
                },
                items: [{
                    xtype:          'selectfield',
                    autoSelect:     false,
                    name:           'topOrder',
                    bind: {
                        store:      '{sTopOrder}',
                        value:      '{form.filter.topOrder}'
                    }
                },{
                    xtype:          'textfield',
                    placeHolder:    me.valueText,
                    name:           'topValue',
                    bind:           '{form.filter.value}'
                },{
                    xtype:          'selectfield',
                    autoSelect:     false,
                    name:           'topType',
                    bind: {
                        store:      '{sTopType}',
                        value:      '{form.filter.topType}'
                    }
                },{
                    xtype:          'selectfield',
                    autoSelect:     false,
                    name:           'topDimensionId',
                    bind: {
                        store:      '{sDimensions}',
                        value:      '{form.filter.dimensionId}'
                    }
                },{
                    xtype:          'togglefield',
                    label:          me.sortResultsText,
                    name:           'topSort',
                    bind:           '{form.filter.topSort}'
                }]
            });
        }

        me.add(items);
    }

});