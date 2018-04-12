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
 * Check if it is IE below 10.
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
 * @param {object} data
 */
function serialize(data) {
  if (isOlderIE) {
    return JSON.stringify(data);
  }
  return data;
}

/**
 * Deserialize the data.
 * @param {string|object} data
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
  serialize,
  deserialize
};
