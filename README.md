Adamite JavaScript client SDK.

[![CircleCI](https://circleci.com/gh/adamitejs/sdk.svg?style=svg)](https://circleci.com/gh/adamitejs/sdk)
[![codecov](https://codecov.io/gh/adamitejs/sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/adamitejs/sdk)

## Installation

```js
yarn add @adamite/sdk
```

## Quick Start

Initialize your app...

```js
const { adamite, AuthPlugin, DatabasePlugin } = require("@adamite/sdk");

adamite.use(AuthPlugin);
adamite.use(DatabasePlugin);

adamite().initiaizeApp({
  apiKey: "...",
  apiUrl: "...",
  databaseUrl: "...",
  authUrl: "..."
});
```

## Documentation

You can find the Adamite documentation [on our website](https://adamite.gitbook.io/docs).

For a quick overview of Adamite, check out the [getting started](https://adamite.gitbook.io/docs/adamite-sdk/get-started-1) guide.

## About Adamite

Adamite is an open source, self host-able, platform as a service.

- **Get up and running quickly:** Adamite lets you develop your apps without worrying about a back end.

- **Database, Authentication, and Functions:** Adamite provides a set of core services required by most applications, and gives you the power to add more to fit your needs.

- **Scale with Adamite:** You're in control of your Adamite instance, and can customize it to fit your needs, even beyond an initial MVP.

### Contributing

Adamite is open source and welcomes contributions. For more information, read our [Contribution Guide](https://adamite.gitbook.io/docs/organization/contributing-to-adamite).

### License

Adamite is [MIT licensed](LICENSE.md).
