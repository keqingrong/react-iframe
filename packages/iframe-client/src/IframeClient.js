import { isInTrustyOrigins, serialize, deserialize } from 'iframe-utils';

class IframeClient {
  constructor() {
    this.trustyOrigins = ['*'];
    this.parentOrigin = window.parent === window ? location.origin : null;
    this.messageHandlers = [];
    this.loose = true;
    this.debug = false;

    this.onWindowMessage = this.onWindowMessage.bind(this);
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
      // This operation may fail because of accessing a cross-origin frame.
      window.parent.postMessage(
        serialize(message),
        window.parent.location.origin
      );
      return;
    }
    window.parent.postMessage(serialize(message), this.parentOrigin);
  }

  /**
   * @private
   * Fired when the window receives a message.
   * @param {MessageEvent} event
   */
  onWindowMessage(event) {
    if (!isInTrustyOrigins(event.origin, this.trustyOrigins)) {
      this.log('Receive a message from an untrusted origin', {
        origin: event.origin,
        data: event.data,
      });
      return;
    }

    if (event.source !== window.parent) {
      this.log('Receive a message from non-parent window, including itself', {
        origin: event.origin,
        data: event.data,
      });
      return;
    }

    if (!this.parentOrigin) {
      this.parentOrigin = event.origin;
    }

    const deserializeData = deserialize(event.data);

    // Common API
    if (this.loose) {
      this.messageHandlers.forEach(handleMessage => {
        handleMessage(deserializeData, event);
      });
      return;
    }

    // New API for ReactIframe component
    const { header, body } = deserializeData;

    if (!header || header.isTrusted === undefined) {
      throw new Error(
        'Opps! Something went wrong, try setting `loose` property to `true`.'
      );
    }

    // The `header.isTrusted` is a boolean. It is true when the message was sent
    // by a user action, and false when the message was sent automatically by
    // ReactIframe component.
    if (header.isTrusted) {
      this.messageHandlers.forEach(handleMessage => {
        handleMessage(body, event);
      });
    } else {
      // TODO: process the message sent automatically by ReactIframe
    }
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
