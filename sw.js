var CACHE_NAME = 'sw-ex';
var CACHE_VERSION = 1;

var filesToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/img/geek.jpg',
  '/images/touch/chrome-touch-icon-192x192.jpg',
  'css/normalize.css',
  'css/bootstrap.css',
  'css/owl.css',
  'css/animate.css',
  'fonts/font-awesome-4.1.0/css/font-awesome.min.css',
  'fonts/eleganticons/et-icons.css',
  'css/cardio.css',
  'js/jquery-1.11.1.min.js',
  'js/owl.carousel.min.js',
  'js/bootstrap.min.js',
  'js/wow.min.js',
  'js/typewriter.js',
  'js/jquery.onepagenav.js',
  'js/main.js'
];

self.oninstall = function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
};

self.onactivate = function(event) {
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName.indexOf(CACHE_NAME) == -1) {
          return;
        }

        if (cacheName != currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
};

self.onfetch = function(event) {
  var request = event.request;
  event.respondWith(
    caches.match(request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message);
            });
          });
        return response;
      });
    })
  );
};


// Communicate via MessageChannel.
self.addEventListener('message', function(event) {
  console.log(`Received message from main thread: ${event.data}`);
  event.ports[0].postMessage(`Got message! Sending direct message back - "${event.data}"`);
});

// Broadcast via postMessage.
function sendMessage(message) {
  self.clients.matchAll().then(function(clients) {
    clients.map(function(client) {
      return client.postMessage(message);
    })
  });
}


/*
  PUSH EVENT:
    will be triggered when a push notification is received
*/

//To send notification to client
self.addEventListener('push', function(event) {
  console.log('Event: Push', event);

  var title = 'Push notification demo';
  var body = 'You have received a notification';
  var tag = 'demo';
  var icon = '/images/touch/icon-128x128.jpg';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: icon
    })
  );
});

/*
  NOTIFICATION EVENT:
    Will be triggered when user click the notification
*/

//On click event for notification to close
self.addEventListener('notificationclick', function(event) {
  console.log('Notification is clicked ', event);
  event.notification.close();
});

