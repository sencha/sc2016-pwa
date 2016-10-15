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
        'Ext.data.proxy.Ajax'
    ],

    listen: {
        component: {
            '*': {
                focus: function(el) {
                    console.log('el', el);
                }
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
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onRefresh: function() {
        this.getStore('personnel').reload();
    },

    exampleCacheThenNetwork: function() {
        Ext.Ajax.request({
            url: '/foo/bar',
            success: {
                cache: function() {
                    // handle cached response
                },
                network: function() {
                    // handle network response
                }
            }
        });

        Ext.create('Ext.data.Store', {
            proxy: 'ajax',
            cacheThenNetwork: true
        })
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
