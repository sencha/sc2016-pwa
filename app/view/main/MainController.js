/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('PWA.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'PWA.view.person.Person',
        'PWA.model.Person'
    ],

    listen: {
        controller: {
            '*': {
                'home': 'showList'
            }
        }
    },

    initViewModel: function() {
        var vm = this.getViewModel();

        // add a way to listen for these in the "listen" object

        window.addEventListener("online", function() {
            vm.set('online', true);
            vm.getStore('personnel').reload();
        });

        window.addEventListener("offline", function() {
            vm.set('online', false);
        });
    },

    onItemSelected: function (sender, record) {
        this.showPerson(record.get('person'));
    },

    onRefresh: function() {
        this.getStore('personnel').reload();
    },

    showPerson: function(person) {
        person = Ext.create('PWA.model.Person', person);
        console.log('loading', person);
        var main = this.lookup('main');
        main.removeAll();
        main.add({
            xtype: 'person',
            viewModel: {
                data: {
                    record: person
                }
            }
        })
    },

    showList: function() {
        var main = this.lookup('main');
        main.removeAll();

        main.add({
            xtype: 'mainlist'
        })
    }
});
