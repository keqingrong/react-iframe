# react-frame

> React iframe component and client

## Packages

| Package | Version |
|---------|---------|
| [`react-inline-frame`](/packages/react-inline-frame) | [![npm](https://img.shields.io/npm/v/react-inline-frame.svg)](https://www.npmjs.com/package/react-inline-frame) |
| [`iframe-client`](/packages/iframe-client) | [![npm](https://img.shields.io/npm/v/iframe-client.svg)](https://www.npmjs.com/package/iframe-client) |

## Installation

```sh
npm install react-inline-frame
npm install iframe-client
```

## Usage

```js
import React from 'react';
import ReactIframe from 'react-inline-frame';

class ReactIframeDemo extends React.Component {
  onIframeLoad = event => {
    console.log("onIframeLoad");

    this.iframe.postMessage({
      type: 'greeting',
      content: ['Hello', 'Bonjour', '你好']
    });
  };

  onIframeMessage = (message, event) => {
    console.log("onIframeMessage", message);
  };

  render() {
    return (
      <ReactIframe
        className="iframe-demo"
        title="iframe-demo"
        src="./embed.html"
        ref={el => {
          this.iframe = el;
        }}
        onLoad={this.onIframeLoad}
        onMessage={this.onIframeMessage}
      />
    );
  }
}
```

```js
const iframeClient = new IframeClient();
iframeClient.trustyOrigins = ['*'];
iframeClient.onMessage((data, event) => {
  console.log('Get a message from the parent window', data);

  iframeClient.postMessage('A auto-response from the embed page');
});
```

## License

MIT
