# iframe-client

[![npm version](https://img.shields.io/npm/v/iframe-client.svg)](https://www.npmjs.com/package/iframe-client)

> An iframe client for the browser

## Installation

```sh
npm install iframe-client
```

## Usage

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
