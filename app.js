/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'PWA',

    extend: 'PWA.Application',

    requires: [
        'PWA.view.main.Main'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: 'PWA.view.main.Main',

    progressive: true
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to PWA.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});

Ext.onReady(function() {
    document.getElementsByTagName('head')[0].innerHTML += '<link rel="manifest" href="resources/manifest.json">';

    // run when progressive: true
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then(function(reg) {
            console.log('Successfully registered service worker', reg);
        }).catch(function(err) {
            console.warn('Error whilst registering service worker', err);
        });
    } else {
        console.log('browser does not support service workers');
    }
});
