const glob = require('glob');
const gulp = require('gulp');
const swPrecache = require('sw-precache');
const path = require('path');

const BUILD_DIR = 'build/production/PWA';

gulp.task('generate-service-worker', () => {
    let serviceWorkerFile = path.join(BUILD_DIR, 'service-worker.js');

    return swPrecache.write(serviceWorkerFile, {
        // Start of interesting bits!

        // Ensure all our static, local assets are cached.
        staticFileGlobs: [
            `${BUILD_DIR}/index.html`,
            `${BUILD_DIR}/app.js`,
            `${BUILD_DIR}/app.json`,
            `${BUILD_DIR}/resources/**.css`,
            `${BUILD_DIR}/resources/**/fonts/**`
        ],

        // Define the dependencies for the server-rendered /shell URL,
        // so that it's kept up to date.
        // dynamicUrlToDependencies: {
        //     '/index.html': [
        //         `${BUILD_DIR}/app.js`,
        //         `${BUILD_DIR}/app.json`,
        //         ...glob.sync(`${BUILD_DIR}/resources/**.css`),
        //         ...glob.sync(`${BUILD_DIR}/resources/**/fonts/**.*`)
        //     ]
        // },

        // Brute force server worker routing:
        // Tell the service worker to use /shell for all navigations.
        // E.g. A request for /guides/12345 will be fulfilled with /shell
        navigateFallback: '/',

        // Various runtime caching strategies: sets up sw-toolbox handlers.
        runtimeCaching: [{
            urlPattern: /users\.json/,
            handler: 'networkFirstCacheBust'
        }, {
            // Use a network first strategy for everything else.
            default: 'networkFirst'
        }],

        ignoreUrlParametersMatching: /^(_dc|v)$/,

        // End of interesting bits...

        cacheId: "pwa",
        // dontCacheBustUrlsMatching: /./,
        stripPrefix: BUILD_DIR + '/',
        verbose: true
    });

});