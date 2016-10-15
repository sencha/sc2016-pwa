/**
 * The default implementation for am event model. All fields are
 * accessed via the getter/setter API to allow for custom model
 * implementations.
 *
 * ## Fields ##
 *
 * The following fields are provided:
 *
 * - title : {String} - Maps to {@link #getTitle} and {@link #setTitle}.
 * - calendarId : {Object} - Maps to {@link #getCalendarId} and {@link #setCalendarId}.
 * - description : {String} - Maps to {@link #getDescription} and {@link #setDescription}.
 * - startDate : {Date} - Maps to {@link #getStartDate} and {@link #getStartDate}.
 * - endDate : {Date} - Maps to {@link #getEndDate} and {@link #getEndDate}.
 * - allDay : {Boolean} - Maps to {@link #getAllDay} and {@link #setAllDay}.
 */
Ext.define('Ext.calendar.model.Event', {
    extend: 'Ext.data.Model',

    mixins: ['Ext.calendar.model.EventBase'],

    requires: [
        'Ext.data.field.String',
        'Ext.data.field.Integer',
        'Ext.data.field.Date',
        'Ext.data.field.Boolean'
    ],

    fields: [{
        name: 'title',
        type: 'string'
    }, {
        name: 'calendarId'
    }, {
        name: 'color',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'startDate',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'endDate',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'allDay',
        type: 'boolean'
    }, {
        name: 'duration',
        type: 'int',
        depends: ['startDate', 'endDate'],
        calculate: function(data) {
            var start = data.startDate,
                end = data.endDate,
                ms = 0;

            if (end && start) {
                ms = end.getTime() - start.getTime();
            }
            return ms / 60000;
        }
    }],

    getAllDay: function() {
        return this.data.allDay;
    },

    getCalendarId: function() {
        return this.data.calendarId;
    },

    getColor: function() {
        return this.data.color;
    },

    getDescription: function() {
        return this.data.description;
    },

    getDuration: function() {
        return this.data.duration;
    },

    getEndDate: function() {
        return this.data.endDate;
    },

    getRange: function() {
        var me = this,
            range = me.range;

        if (!range) {
            me.range = range = new Ext.calendar.date.Range(me.getStartDate(), me.getEndDate());
        }
        return range;
    },

    getStartDate: function() {
        return this.data.startDate;
    },

    getTitle: function() {
        return this.data.title;
    },

    isEditable: function() {
        var calendar = this.getCalendar();
        return calendar ? calendar.isEditable() : true;
    },

    setAllDay: function(allDay) {
        this.set('allDay', allDay);
    },

    setCalendarId: function(calendarId, dirty) {
        dirty = dirty !== false;
        this.set('calendarId', calendarId, {
            dirty: dirty
        });
    },

    setColor: function(color) {
        this.set('color', color);
    },

    setData: function(data) {
        var duration = data.duration;

        if (duration) {
            data = Ext.apply({}, data);
            delete data.duration;
            this.setDuration(duration)
        } else if (data.startDate && data.endDate) {
            this.range = null;
        }
        this.set(data);
    },

    setDescription: function(description) {
        this.set('description', description);
    },

    setDuration: function(duration) {
        var D = Ext.Date;
        this.range = null;
        this.set('endDate', D.add(this.data.startDate, D.MINUTE, duration));
    },

    setRange: function(start, end) {
        var D = Ext.Date;

        if (start.isRange) {
            end = start.end;
            start = start.start;
        }
        this.range = null;
        this.set({
            startDate: D.clone(start),
            endDate: D.clone(end)
        });
    },

    setTitle: function(title) {
        this.set('title', title);
    }
});