import isSameOrigin from 'is-same-origin';

const location = window.location;

const isOlderIE = checkOlderIE();

/**
 * Build origin from URL string.
 * @param {string} src - URL string
 * @param {string} [href] - URL string
 * @returns {string|null}
 */
function buildOrigin(src, href) {
  try {
    const url = new URL(src, href || location.href);
    return url.origin;
  } catch (error) {
    return null;
  }
}

/**
 * Check if the URL is included in the trusty origin array.
 * If there is an asterisk (*) in the trusty origin array, it will
 * always return true.
 * @param {string} url - URL string
 * @param {string[]} trustyOrigins - trusty origin array
 * @returns {boolean}
 */
function isInTrustyOrigins(url, trustyOrigins) {
  const len = trustyOrigins.length;
  for (let i = 0; i < len; i++) {
    if (trustyOrigins[i] === '*') {
      return true;
    }
    if (isSameOrigin(trustyOrigins[i], url)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if it is IE below 10.
 * @returns {boolean}
 */
function checkOlderIE() {
  const ua = navigator.userAgent;
  const isIE = ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1;
  if (!isIE) {
    return false;
  }
  const version = ua.match(/(MSIE\s|Trident.*rv:)([\w.]+)/)[2];
  const versionNumber = parseFloat(version);
  if (versionNumber < 10) {
    return true;
  }
  return false;
}

/**
 * Serialize the data in older versions of IE.
 * See
 * - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
 * - https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 * @param {Object} data
 * @returns {Object|string}
 */
function serialize(data) {
  if (isOlderIE) {
    return JSON.stringify(data);
  }
  return data;
}

/**
 * Deserialize the data.
 * @param {string|Object} data
 * @returns {Object|string}
 */
function deserialize(data) {
  if (isOlderIE) {
    try {
      return JSON.parse(data);
    } catch (error) {
      // do nothing
    }
  }
  return data;
}

export {
  buildOrigin,
  isInTrustyOrigins,
  serialize,
  deserialize
};


