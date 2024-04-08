/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
// if (!self.define) {
//   let registry = {};

//   // Used for `eval` and `importScripts` where we can't get script URL by other means.
//   // In both cases, it's safe to use a global var because those functions are synchronous.
//   let nextDefineUri;

//   const singleRequire = (uri, parentUri) => {
//     uri = new URL(uri + ".js", parentUri).href;
//     return registry[uri] || (

//         new Promise(resolve => {
//           if ("document" in self) {
//             const script = document.createElement("script");
//             script.src = uri;
//             script.onload = resolve;
//             document.head.appendChild(script);
//           } else {
//             nextDefineUri = uri;
//             importScripts(uri);
//             resolve();
//           }
//         })

//       .then(() => {
//         let promise = registry[uri];
//         if (!promise) {
//           throw new Error(`Module ${uri} didn’t register its module`);
//         }
//         return promise;
//       })
//     );
//   };

//   self.define = (depsNames, factory) => {
//     const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
//     if (registry[uri]) {
//       // Module is already loading or loaded.
//       return;
//     }
//     let exports = {};
//     const require = depUri => singleRequire(depUri, uri);
//     const specialDeps = {
//       module: { uri },
//       exports,
//       require
//     };
//     registry[uri] = Promise.all(depsNames.map(
//       depName => specialDeps[depName] || require(depName)
//     )).then(deps => {
//       factory(...deps);
//       return exports;
//     });
//   };
// }
// define(['./workbox-1e54d6fe'], (function (workbox) { 'use strict';

//   importScripts("/fallback-development.js");
//   self.skipWaiting();
//   workbox.clientsClaim();

//   /**
//    * The precacheAndRoute() method efficiently caches and responds to
//    * requests for URLs in the manifest.
//    * See https://goo.gl/S9QRab
//    */
//   workbox.precacheAndRoute([{
//     "url": "/_next/data/development/fallback.json",
//     "revision": "development"
//   }, {
//     "url": "/fallback-font.woff2",
//     "revision": "development"
//   }, {
//     "url": "/fallback.mp3",
//     "revision": "development"
//   }, {
//     "url": "/fallback.mp4",
//     "revision": "development"
//   }, {
//     "url": "/fallback.webp",
//     "revision": "development"
//   }, {
//     "url": "/~offline",
//     "revision": "development"
//   }], {
//     "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /ts/]
//   });
//   workbox.cleanupOutdatedCaches();
//   workbox.registerRoute("/", new workbox.NetworkFirst({
//     "cacheName": "start-url",
//     plugins: [{
//       cacheWillUpdate: async ({
//         response: e
//       }) => e && "opaqueredirect" === e.type ? new Response(e.body, {
//         status: 200,
//         statusText: "OK",
//         headers: e.headers
//       }) : e
//     }, {
//       handlerDidError: async ({
//         request: e
//       }) => "undefined" != typeof self ? self.fallback(e) : Response.error()
//     }]
//   }), 'GET');
//   workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
//     "cacheName": "dev",
//     plugins: [{
//       handlerDidError: async ({
//         request: e
//       }) => "undefined" != typeof self ? self.fallback(e) : Response.error()
//     }]
//   }), 'GET');

// }));
//# sourceMappingURL=sw.js.map

/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /**@type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);
sw.addEventListener('push', event => {
  const message = event.data.json();
  const {title, description, slug, image, icon, url} = message;
  console.log(message);
  async function handlePushEvent() {
    const windowClient = await sw.clients.matchAll({
      type: 'window',
    });
    if (windowClient.length > 0) {
      const appInForeground = windowClient.some(client => client.focused);

      if (appInForeground) {
        console.log('APP in forground');
        return;
      }
    }
    await sw.registration.showNotification(title, {
      body: description,
      icon: icon,
      image: image,
      badge: '/logo1.png',
      actions: [
        {
          title: 'View Post',
          action: 'open_post',
        },
      ],
      tag: slug,
      renotify: true,
      data: {
        url: url,
      },
    });
  }
  event.waitUntil(handlePushEvent());
});

sw.addEventListener('notificationclick', event => {
  const notification = event.notification;
  console.log('notification', notification);
  async function handleNotificationClick() {
    const windowClient = await sw.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    const url = notification.data.url;
    console.log(url);
    if (windowClient.length > 0) {
      // await windowClient[0].navigate(url);
      await sw.clients.openWindow(url);
    } else {
      await sw.clients.openWindow(url);
    }
  }

  event.waitUntil(handleNotificationClick());
});
