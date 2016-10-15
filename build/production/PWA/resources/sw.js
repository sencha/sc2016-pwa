var progressive = {
    "serviceWorker": "service-worker.js",

    "manifest": {
        "lang": "en",
        "name": "PWA",
        "short_name": "ExtJS PWA",
        "description": "Ext JS Progressive App",
        "icons": [{
            "src": "icon-small.png",
            "sizes": "96x96"
        }, {
            "src": "icon-normal.png",
            "sizes": "192x192"
        }, {
            "src": "icon-medium.png",
            "sizes": "256x256"
        }],
        "splash_screens": [{
            "src": "splash.png",
            "sizes": "600x800"
        }],
        "theme_color": "#2ebd59", // optional, pull from base-color?
        "background_color": "#000",
        "display": "standalone",
        "orientation": "portrait",
        "start_url": "index.html"
    },

    "cacheName": "PWA:1.0.1",

    "maxCacheEntries": 100,

    "precache": [
        // "../index.html",
        // "../app.js",
        "icon-large.png",
        "icon-normal.png",
        "icon-medium.png",
        "icon-small.png",
        "splash.png",
        "fonts/roboto/Roboto-Bold.ttf",
        "fonts/roboto/Roboto-Italic.ttf",
        "fonts/roboto/Roboto-Light.ttf",
        "fonts/roboto/Roboto-Medium.ttf",
        "fonts/roboto/Roboto-Regular.ttf",
        "font-awesome/fonts/FontAwesome.otf",
        "font-awesome/fonts/fontawesome-webfont.eot",
        "font-awesome/fonts/fontawesome-webfont.svg",
        "font-awesome/fonts/fontawesome-webfont.ttf",
        "font-awesome/fonts/fontawesome-webfont.woff",
        "font-awesome/fonts/fontawesome-webfont.woff2"
    ],

    "caches": {
        "images": {
            networkTimeoutSeconds: 25
        },
        "asset": {

        },
        "api": {

        }
    },

    "routes": [
        {
            method: 'get',
            urlPattern: /users\.json/,
            cache: 'api',
            strategy: 'networkFirst'
        // },
        // {
        //     method: 'get',
        //     urlPattern: /index\.html/,
        //     cache: 'asset',
        //     strategy: 'networkFirst'
        // },
        // {
        //     method: 'get',
        //     urlPattern: /(app\.js(on)?)|(resources\/PWA-all\.css)/,
        //     cache: 'asset',
        //     strategy: 'cacheFirst'
        }
    ]
};

importScripts('./resources/sw-toolbox.js');

var toolbox = self.toolbox;
toolbox.options.debug = true;
toolbox.options.cache.name = progressive.cacheName;
if (progressive.maxCacheEntries) toolbox.options.cache.maxEntries = progressive.maxCacheEntries;
if (progressive.precache) toolbox.precache(progressive.precache);


/**
 * Returns a function that handles the request with the ?_dc query parameter removed.  This allows us to cache
 * no cache urls when service workers are available while preserving the no cache behaviour when they are not.
 * @param {Function} handler
 * @returns {Function}
 */
function removeNoCacheParam(handler) {
    return function() {
        var args = Array.from(arguments);
        var request = args[0];
        var url = request.url.replace(/_dc=\d+&?/, '');
        args[0] = new Request(url, request);
        console.log('cache ' + url);
        return handler.apply(this, args);
    }
}

// create cache rules using sw-toolbox
progressive.routes.forEach(function(route) {
    var options = route.cache && Object.assign({}, { cache: progressive['cacheName'] + ':' + route.cache }, progressive.caches[route.cache]);

    console.log('caching ' + route.urlPattern + ' => ' + route.strategy);

    toolbox.router[(route.method || 'any').toLowerCase()](route.urlPattern, removeNoCacheParam(toolbox[route.strategy]), options);
});

// activate the service worker
self.addEventListener('install', function(e){
    self.skipWaiting();
});
