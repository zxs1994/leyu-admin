// sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装完成')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活')
})

// self.addEventListener('fetch', (event) => {
//   event.respondWith(fetch(event.request))
// })
