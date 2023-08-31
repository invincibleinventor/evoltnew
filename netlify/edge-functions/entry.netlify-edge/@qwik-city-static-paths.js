const staticPaths = new Set(["/_headers","/favicon.ico","/favicons/android-chrome-192x192.png","/favicons/android-chrome-256x256.png","/favicons/apple-touch-icon.png","/favicons/favicon.svg","/fonts/SF-Pro.ttf","/logos/qwik-logo.svg","/logos/qwik.svg","/q-manifest.json"]);
function isStaticPath(method, url) {
  if (method.toUpperCase() !== 'GET') {
    return false;
  }
  const p = url.pathname;
  if (p.startsWith("/build/")) {
    return true;
  }
  if (p.startsWith("/assets/")) {
    return true;
  }
  if (staticPaths.has(p)) {
    return true;
  }
  if (p.endsWith('/q-data.json')) {
    const pWithoutQdata = p.replace(/\/q-data.json$/, '');
    if (staticPaths.has(pWithoutQdata + '/')) {
      return true;
    }
    if (staticPaths.has(pWithoutQdata)) {
      return true;
    }
  }
  return false;
}
export { isStaticPath };