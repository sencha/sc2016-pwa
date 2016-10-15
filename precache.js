const swPrecache = require('sw-precache');
const path = require('path');
const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

let { buildDir, config } = require('minimist')(process.argv.slice(2), {
    string: ['buildDir', 'config']
});

if (!buildDir || !config) {
    console.log(`
Usage
    $ node create-service-worker
    
Options
  --buildDir The path to build dir where the service worker should be created
  --config The path to the json file containing the configuration for sw-precache

Example
    $ node create-service-worker --buildDir=build/production/MyApp --config=build/production/temp/sw-precache-config.json
    `);

    process.exit(0);
};

config = JSON.parse(fs.readFileSync(config, 'utf8'));

config.runtimeCaching = config.runtimeCaching || [];

// convert urls to regular expressions
for (let entry of config.runtimeCaching) {
    if (entry.url) {
        entry.urlPattern = new RegExp(`${escapeStringRegexp(entry.url)}(\\?|$)`);
        delete entry.url;
    }
}

// the path to the service worker we're going to create
const buildSW = path.join(buildDir, 'service-worker.js');

// this will be stripped from the from of each path to produce the url for caching
config.stripPrefix =  buildDir + '/';

// the resources that make up the app shell.  These will be precached.
config.staticFileGlobs = (config.staticFileGlobs || []).concat([
    `${buildDir}/index.html`,
    `${buildDir}/app.js`,
    `${buildDir}/app.json`,
    `${buildDir}/resources/**.css`,
    `${buildDir}/resources/**/fonts/**`
]);

// Strip off _dc before caching.  This allows app.json to be cached (which always has a new _dc on page reload)
// sw-precache does its own cache busting, so the user will never get a stale app shell.
config.ignoreUrlParametersMatching = config.ignoreUrlParametersMatching || /^(_dc|v)$/;

// Here we replace sw-toolbox's networkFirst handler with one that plays well with Ext JS's standard noCache parameter
// First we attempt to fetch the url from the network as-is.  If a response is returned it is cached under a key with the
// noCache param removed so that if the same request is made later when offline with a new noCache value, we can return
// the cached response.  Without this all ajax requests would result in a cache miss and the cache would keep growing
// indefinitely.
const handlers = `
function stripNoCache(request) {
    var url = request.url.replace(/_dc=\\d+&?/, '');
    return new Request(url, request);
}

toolbox.networkFirst = function (request, values, options) {
    return toolbox.networkOnly(request, values, options)
        .then(function(response) {
            var cacheName = (options.cache && options.cache.name) || toolbox.options.cache.name;

            // cache response with _dc removed
            caches.open(cacheName).then(function(cache) {
                cache.put(stripNoCache(request), response)
            });

            return response.clone();
        })
        .catch(function(err) {
            return caches.match(stripNoCache(request))
        });
};
`;

// create the service worker
swPrecache.write(buildSW, config).then(() => {
    let serviceWorkerJS = fs.readFileSync(buildSW, 'utf8');
    serviceWorkerJS = serviceWorkerJS.replace(/(\/\/ Runtime cache configuration)/, handlers + '\n$1');
    fs.writeFileSync(buildSW, serviceWorkerJS, 'utf8')
}).catch(e => {
    console.log(`error creating ${buildSW}`, e);
    process.exit(1);
});

