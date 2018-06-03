import { isInTrustyOrigins, serialize, deserialize } from 'iframe-utils';

class IframeClient {
  constructor() {
    this.trustyOrigins = ['*'];
    this.parentOrigin = null;
    this.messageHandlers = [];
    this.debug = false;

    this.attachEvents();
  }

  /**
   * @public
   * Receive messages from the iframe.
   * @param {function} handler - a message handler
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  /**
   * @public
   * Send a message to the parent window.
   * @param {Object|string} message - a message
   */
  postMessage(message) {
    if (!this.parentOrigin) {
      return;
    }
    window.parent.postMessage(serialize(message), this.parentOrigin);
  }

  /**
   * @private
   * Fired when the window receives a message.
   * @param {MessageEvent} event
   */
  onWindowMessage = (event) => {
    const that = this;
    if (!isInTrustyOrigins(event.origin, this.trustyOrigins)) {
      that.log('Receive a message from an untrusted origin', {
        origin: event.origin,
        data: event.data
      });
      return;
    }

    if (event.source !== window.parent) {
      that.log('Receive a message from non-parent window, including itself', {
        origin: event.origin,
        data: event.data
      });
      return;
    }

    that.parentOrigin = event.origin;
    const deserializeData = deserialize(event.data);

    that.messageHandlers.forEach((handler) => {
      handler(deserializeData, event);
    });
  }

  /**
   * @public
   * Attach events.
   */
  attachEvents() {
    window.addEventListener('message', this.onWindowMessage, false);
  }

  /**
   * @public
   * Detach events.
   */
  detachEvents() {
    window.removeEventListener('message', this.onWindowMessage, false);
  }

  /**
   * @private
   * Print the log.
   */
  log(...args) {
    if (this.debug) {
      console.log(...args); // eslint-disable-line no-console
    }
  }
}

export default IframeClient;
