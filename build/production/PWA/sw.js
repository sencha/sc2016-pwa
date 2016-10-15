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
        "/",
        "app.json?_dc=1476121555035",
        "index.html",
        "app.js",
        "app.json",
        "resources/icon-large.png",
        "resources/icon-normal.png",
        "resources/icon-medium.png",
        "resources/icon-small.png",
        "resources/splash.png",
        "resources/fonts/roboto/Roboto-Bold.ttf",
        "resources/fonts/roboto/Roboto-Italic.ttf",
        "resources/fonts/roboto/Roboto-Light.ttf",
        "resources/fonts/roboto/Roboto-Medium.ttf",
        "resources/fonts/roboto/Roboto-Regular.ttf",
        "resources/font-awesome/fonts/FontAwesome.otf",
        "resources/font-awesome/fonts/fontawesome-webfont.eot",
        "resources/font-awesome/fonts/fontawesome-webfont.svg",
        "resources/font-awesome/fonts/fontawesome-webfont.ttf",
        "resources/font-awesome/fonts/fontawesome-webfont.woff",
        "resources/font-awesome/fonts/fontawesome-webfont.woff2"
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

if (progressive.precache) {
    toolbox.precache(progressive.precache);

    for (let url of progressive.precache) {
        toolbox.router.get(url, toolbox.networkFirst)
    }
}


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
    toolbox.router[(route.method || 'any').toLowerCase()](route.urlPattern, removeNoCacheParam(toolbox[route.strategy]), options);
});

// activate the service worker
self.addEventListener('install', function(e){
    e.waitUntil(self.skipWaiting());
});

// attach to all tabs
self.addEventListener('activate',  event => {
    event.waitUntil(self.clients.claim());
});

/////////////////


function stripNoCache(request) {
    var url = request.url.replace(/_dc=\d+&?/, '');
    return new Request(url, request);
}

function networkFirstWithNoCache(request, values, options) {
    return toolbox.networkFirst(request, values, options)
        .then(response => {
            // cache response with _dc removed
            caches.open(options.cache.name).then(cache => cache.put(stripNoCache(request), response));
            return response.clone();
        })
        .catch(err => {
            return caches.match(stripNoCache(request))
        });
}

// Runtime cache configuration, using the sw-toolbox library.

toolbox.router.get(/users\.json/, networkFirstWithNoCache, { cache: { name: 'api' }});
toolbox.router.default = toolbox.networkFirst;