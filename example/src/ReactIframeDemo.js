import React from 'react';
import ReactIframe from 'react-inline-frame';

let count = 0;
const uuid = () => {
  count++;
  return count;
};

class ReactIframeDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messageList: []
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onIframeLoad = this.onIframeLoad.bind(this);
    this.onIframeMessage = this.onIframeMessage.bind(this);
  }

  onChange(event) {
    this.setState({
      message: event.target.value
    });
  }

  onClick() {
    if (this.state.message.trim().length) {
      this.iframe.postMessage(this.state.message);
    }
  }

  onIframeLoad(event) {
    console.log('onIframeLoad');
  }

  onIframeMessage(message, event) {
    console.log('onIframeMessage', message);
    this.setState({
      messageList: this.state.messageList.concat({
        key: uuid(),
        value: message
      })
    });
  }

  render() {
    return (
      <div className="box-container">
        <div className="box">
          <ReactIframe
            className="iframe-demo"
            title="iframe-demo"
            src="./embed.html"
            // src="//127.0.0.1:8080/embed.html"
            style={{
              width: '100%',
              height: '100%'
            }}
            ref={el => {
              this.iframe = el;
            }}
            onLoad={this.onIframeLoad}
            onMessage={this.onIframeMessage}
            debug
          />
        </div>
        <div className="box page">
          <h1 className="page-origin-title">origin:
            <code> {window.location.origin}</code>
          </h1>
          <h2 className="page-type-title">current page</h2>
          <ul>
            {this.state.messageList.map(message => {
              return <li key={message.key}>child: {message.value}</li>;
            })}
          </ul>
          <input
            type="text"
            value={this.state.message}
            onChange={this.onChange}
          />
          <button type="button" onClick={this.onClick}>
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default ReactIframeDemo;
