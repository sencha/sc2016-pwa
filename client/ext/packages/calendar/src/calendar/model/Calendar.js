/**
 * The default implementation for a calendar model. All fields are
 * accessed via the getter/setter API to allow for custom model
 * implementations.
 *
 * ## Fields ##
 *
 * The following fields are provided:
 *
 * - title : {String} - Maps to {@link #getTitle} and {@link #setTitle}.
 * - description : {String} - Maps to {@link #getDescription} and {@link #setDescription}.
 * - color : {String} - Maps to {@link #getColor} and {@link #setColor}.
 * - hidden : {Boolean} - Maps to {@link #getHidden} and {@link #setHidden}.
 * - editable : {Boolean} - Maps to {@link #getEditable} and {@link #setEditable}.
 * - eventStore : {Object} - Allow per-instance configuration for the {@link #events} store. 
 * This configuration is merged with the {@link #eventStoreDefaults}.
 */
Ext.define('Ext.calendar.model.Calendar', {
    extend: 'Ext.data.Model',

    mixins: ['Ext.calendar.model.CalendarBase'],

    requires: [
        'Ext.data.field.String',
        'Ext.data.field.Boolean'
    ],

    fields: [{
        name: 'title',
        type: 'string'
    }, {
        name: 'description', 
        type: 'string'
    }, {
        name: 'color', 
        type: 'string'
    }, {
        name: 'assignedColor',
        type: 'string',
        persist: false
    }, {
        name: 'hidden',
        type: 'bool'
    }, {
        name: 'editable',
        type: 'bool',
        defaultValue: true
    }, {
        name: 'eventStore',
        type: 'auto',
        persist: false
    }],

    constructor: function(data, session) {
        this.callParent([data, session]);
        // Force base color to be assigned
        this.getBaseColor();
    },

    getAssignedColor: function() {
        return this.data.assignedColor;
    },

    getColor: function() {
        return this.data.color;
    },

    getDescription: function() {
        return this.data.description;
    },

    getEditable: function() {
        return this.data.editable;
    },

    getEventStoreConfig: function(cfg) {
        return Ext.merge(cfg, this.data.eventStore);
    },

    getHidden: function() {
        return this.data.hidden;
    },

    getTitle: function() {
        return this.data.title;
    },

    setAssignedColor: function(color) {
        this.set('assignedColor', color);
    },

    setColor: function(color) {
        this.set('color', color);
    },

    setDescription: function(description) {
        this.set('description', description);
    },

    setEditable: function(editable) {
        this.set('editable', editable);
    },

    setHidden: function(hidden) {
        this.set('hidden', hidden);
    },

    setTitle: function(title) {
        this.set('title', title);
    }
});