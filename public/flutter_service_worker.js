'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "8c76998e7dc33f77ff219149cb53aa98",
"assets/assets/deploy_version.txt": "6e9f35067914196dbf06bd495a416faf",
"assets/assets/images/avatar.jpg": "657b719e2216a48b99abacac394d9d66",
"assets/assets/images/background.jpg": "3cbaa4e6afc7ff973cd33549225eca18",
"assets/assets/images/logo.jpg": "08483cdcd0997d80ad3b03f1b98fe104",
"assets/assets/images/logo.png": "d8c544cb1c8cee95842c24efcc7f33d1",
"assets/assets/images/logo_500.jpg": "c4cef3db55770a74f5c11d9a3a68cfbe",
"assets/assets/locales/en.json": "fd531de2103c2eb4305b5b3147bc0879",
"assets/assets/locales/th.json": "57f56949d7a13cdf6ab8a60305a0e905",
"assets/assets/locales/vi.json": "57f56949d7a13cdf6ab8a60305a0e905",
"assets/assets/svg/@.svg": "2f54672122a04e17aec352a881b08fd0",
"assets/assets/svg/account.svg": "9edca94e453a5a2fa47363a8fb70bb00",
"assets/assets/svg/buildingManagement.svg": "edd263b901f0d437d2e9753dafe68e60",
"assets/assets/svg/check.svg": "0e529f0153eb822697c94ba54114ec84",
"assets/assets/svg/dashboard.svg": "3c50b73487a29a9a5a950e4e3c5a61dd",
"assets/assets/svg/edit.svg": "56ece7aaeb741f91779040a2b0a2cd96",
"assets/assets/svg/faceID.svg": "b61942e3f227a29894884d06e8cd117b",
"assets/assets/svg/feedBack.svg": "86d4a930ebb407f07f66d89366811980",
"assets/assets/svg/healthyCheck.svg": "68ccac47da50d3d220a857def4b9839b",
"assets/assets/svg/hidden.svg": "7d295dcd9bd6bd4cffede6d3d44a3da3",
"assets/assets/svg/home.svg": "4a4456b10b143b4ee3f24895efee0c95",
"assets/assets/svg/logout.svg": "d83c41e1ea050a73aae36faf71501b85",
"assets/assets/svg/notification.svg": "be84afe728f093713f24cc8464663360",
"assets/assets/svg/occupancyMonitor.svg": "82f5df2bac0f4f02b049a28cbed4a07c",
"assets/assets/svg/password.svg": "408b6531e70a52200fa5050e7e15afd0",
"assets/assets/svg/report.svg": "d8a506e6e37b688c74af126c8d871c54",
"assets/assets/svg/riskManagement.svg": "0ac184af498e8bd3b282e159eeb11c8d",
"assets/assets/svg/setting.svg": "9c23df792f56682ecae72f79d1f8347b",
"assets/assets/svg/smartMeeting.svg": "47ec2e62b10d2aa861a59ffc9603134d",
"assets/assets/svg/smartParking.svg": "208a181a001e0943feb038e1cbd64051",
"assets/assets/svg/support.svg": "fbf448d8e4d74f5a2ec960e8cc5d301f",
"assets/assets/svg/telephone.svg": "f2141a92e74a6e42d1efdd2d44f4782b",
"assets/assets/svg/userManagement.svg": "505017bc367ff4502b97759ab7f13caf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "03deb209b3ea9851df25c17ad2c41b72",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/timezone/data/2020a.tzf": "84285f1f81b999f1de349a723574b3e5",
"canvaskit/canvaskit.js": "62b9906717d7215a6ff4cc24efbd1b5c",
"canvaskit/canvaskit.wasm": "b179ba02b7a9f61ebc108f82c5a1ecdb",
"canvaskit/profiling/canvaskit.js": "3783918f48ef691e230156c251169480",
"canvaskit/profiling/canvaskit.wasm": "6d1b0fc1ec88c3110db88caa3393c580",
"favicon.png": "b3de2b4d4469f899371543025518bf49",
"icons/Icon-192.png": "7bf02444e9a0e976a5774d80cf93bb36",
"icons/Icon-512.png": "fdbd97c5f0001ba8d519ab9bcb9e6a4e",
"index.html": "821fc7d7a4d9447efba668a781c3ea49",
"/": "821fc7d7a4d9447efba668a781c3ea49",
"main.dart.js": "34978e0d69adaa4a7d388712f7abc5ae",
"manifest.json": "e53086b48c6223d3dbd3273ba18fa4e8",
"version.json": "05c9a5fc9acf597c5dcc347e42df1bf5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
