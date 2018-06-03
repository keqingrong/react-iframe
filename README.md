# react-inline-frame

[![npm version](https://img.shields.io/npm/v/react-inline-frame.svg)](https://www.npmjs.com/package/react-inline-frame)

> React iframe component

## Installation

```sh
npm install react-inline-frame
npm install iframe-client
```

## Usage

```js
import React from "react";
import ReactIframe from "react-inline-frame";

class ReactIframeDemo extends React.Component {
  onIframeLoad = event => {
    console.log("onIframeLoad");

    this.iframe.postMessage({
      type: "greeting",
      content: ["Hello", "Bonjour", "你好"]
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
iframeClient.trustyOrigins = ["*"];
iframeClient.onMessage((data, event) => {
  console.log("A message from ");
  iframeClient.postMessage("我是一条来自 iframe 的自动回复");
});
```

## License

MIT
