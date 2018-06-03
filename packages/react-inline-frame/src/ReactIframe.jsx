import React from 'react';
import PropTypes from 'prop-types';
import { buildOrigin, serialize, deserialize } from 'iframe-utils';

class ReactIframe extends React.PureComponent {
  /*eslint-disable no-unused-vars */
  static defaultProps = {
    className: '',
    debug: false,
    src: '',
    style: null,
    title: '',
    onLoad: (event) => { },
    onMessage: (message, event) => { }
  }
  /*eslint-enable no-unused-vars */

  static propTypes = {
    className: PropTypes.string,
    debug: PropTypes.bool,
    src: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
    onLoad: PropTypes.func,
    onMessage: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.loaded = false;
  }

  componentDidMount() {
    window.addEventListener('message', this.messageHandler, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageHandler, false);
  }

  /**
   * @private
   * Print the log.
   */
  log = (...args) => {
    if (this.props.debug) {
      console.log(...args); // eslint-disable-line no-console
    }
  }

  /**
   * @private
   * Handle the message from the iframe.
   * @param {Event} event
   */
  messageHandler = (event) => {
    const targetOrigin = buildOrigin(this.props.src);
    if (!targetOrigin || targetOrigin !== event.origin) {
      this.log('A message from other origins.', event.data);
      return;
    }
    if (event.source !== this.iframe.contentWindow) {
      this.log('A message from other windows.', event.data);
      return;
    }
    this.onMessage(deserialize(event.data), event);
  }

  /**
   * @private
   * The iframe has loaded or failed to load.
   * @param {Event} event
   */
  onLoad = (event) => {
    this.loaded = true;
    this.log('The iframe has loaded or failed to load.');
    this.props.onLoad(event);
  }

  /**
   * @private
   * Receive the message from the iframe.
   */
  onMessage = (message, event) => {
    this.log('A message from the iframe.', message);
    this.props.onMessage(message, event);
  }

  /**
   * @public
   * Send a message to the iframe.
   * @param {Object|string} message - a message
   * @param {string} [targetOrigin] - target origin (scheme+host+port)
   */
  postMessage = (message, targetOrigin) => {
    const serializedMessage = serialize(message);
    const safeTargetOrigin = targetOrigin || buildOrigin(this.props.src);
    if (safeTargetOrigin) {
      if (!this.loaded) {
        /*eslint-disable no-console */
        console.warn('Please try to send the message after the iframe is loaded.');
        /*eslint-enable no-console */
        return;
      }
      this.iframe.contentWindow.postMessage(serializedMessage, safeTargetOrigin);
    }
  }

  render() {
    const { className, src, style, title, ...others } = this.props;
    delete others.debug;
    delete others.onLoad;
    delete others.onMessage;
    return (
      <iframe
        title={title}
        className={`react-iframe ${className}`}
        src={src}
        style={style}
        frameBorder="0"
        ref={el => { this.iframe = el; }}
        onLoad={this.onLoad}
        {...others}
      >
      </iframe>
    );
  }
}

export default ReactIframe;
