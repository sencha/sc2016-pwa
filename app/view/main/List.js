/**
 * This view is an example list of people.
 */
Ext.define('PWA.view.main.List', {
    extend: 'Ext.Panel',
    xtype: 'mainlist',

    cls: 'home-events',

    requires: [
        'Ext.plugin.PullRefresh'
    ],

    title: 'Home',

    header: {
        ui: 'dark-header',
        items: {
            ui: 'dark flat large',
            xtype: 'button',
            docked: 'left',
            iconCls: 'x-fa fa-bars',
            handler: 'onBackTap',
            margin: '0 5 0 0'
        }
    },

    items: {
        xtype: 'list',

        bind: {
            store: '{personnel}'
        },

        plugins: [
            {
                xclass: 'Ext.plugin.PullRefresh',
                pullText: 'Pull down for more new Tweets!'
            }
        ],

        itemTpl: [
            '<div class="item-wrapper">',
                '<div class="badge event-{type}">',
                    '<div class="date">{date:date("M j")}</div>',
                    '<div class="title">',
                        '<tpl switch="type">',
                        '<tpl case="birthday">Birthday',
                        '<tpl case="anniversary">Anniversary',
                        '<tpl case="started">Arrival',
                        '<tpl case="ended">Departure',
                        '</tpl>',
                    '</div>',
                '</div>',
                '<div class="content">',
                    '<div class="picture large" style="background-image:url({person.picture})"></div>',
                    '<div class="details">',
                        '<div class="person-name">{person.firstname} {person.lastname}</div>',
                        '<div class="person-title">{person.title}</div>',
                        '<tpl switch="type">',
                        '<tpl case="birthday">{person.birthday:dateDiff(values.date, "y")} old',
                        '<tpl case="anniversary">{person.started:dateDiff(values.date, "y")} ',
                        '<tpl default>&nbsp;',
                        '</tpl>',
                    '</div>',
                '</div>',
            '</div>'
        ],

        itemConfig: {
            ui: 'cards',
            header: {
                ui: 'cards'
            }
        },

        listeners: {
            select: 'onItemSelected'
        }
    }
});
