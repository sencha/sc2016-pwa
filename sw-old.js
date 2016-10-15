function getCacheKey(request) {
    return request.url.replace(/_dc=\d+/, '');
}

self.addEventListener('fetch', function(event) {
    var fetchRequest = event.request.clone();

    event.respondWith(
        fetch(fetchRequest).then(function(response) {
            // Check if we received a valid response
            if (response && response.status === 200 && response.type === 'basic') {
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();

                caches.open(CACHE_NAME).then(function(cache) {
                    var key = getCacheKey(event.request);
                    console.log('caching', key);
                    cache.put(key, responseToCache);
                });
            }

            return response;
        }).catch(function(error) {
            // `fetch()` throws an exception when the server is unreachable but not
            // for valid HTTP responses, even `4xx` or `5xx` range.
            return caches.open(CACHE_NAME).then(function(cache) {
                var key = getCacheKey(event.request);

                return cache.match(key).then(function(response) {
                    console.log('cache hit!', response);
                    return response;
                });
            });
        })
    )

});