# Cryptochat

Cryptochat is a fully-featured end-to-end encrypted realtime chat application built using NodeJS, React, and WebSockets.

This project was created by:

- Lukas Romsicki
- Khaled Mohamed
- Robert Irwin

## Features

- End-to-end encryption of all messages using **256-bit AES**.
- Symmetric key exchange using **4096-bit RSA-OAEP** hashed using **SHA-256**.
- Realtime communication _via_ WebSockets.
- Group communication with infinitely many users.
- JSON Web Token authentication.
- Local private key storage with `*.pem` files.
- Persisted conversations and messages (still encrypted).
- Client app is hosted by the server application for unified deployment. Encryption/decryption/key generation remains solely available in the client app, with no unencrypted data exchange with the server.

## Technology stack

- [TypeScript](https://www.typescriptlang.org) as a language of choice with [Sass](https://sass-lang.com).
- [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) in the browser for accelerated key generation, encryption, and decryption.
- [JSON Web Tokens](https://jwt.io) as a form of authentication.
- [ReactJS](https://reactjs.org) for front-end client application.
- [NextJS](https://nextjs.org) application architecture framework. Also provides server-side rendering of the client app.
- [socket.io](https://socket.io) for realtime messaging and communication.
- [Express](http://expressjs.com) server backbone.
- [NodeJS](https://nodejs.org/en/) version 15.10.0.
- [TypeORM](https://typeorm.io/) as a database management interface from the server.
- [PostgreSQL](https://www.postgresql.org) as a database management system.

## Installation

> **Note:** Most versions of NodeJS since `v10` should work.

There are a few prerequisites that must be met in order for the application to launch. Firstly, the PostgreSQL server must be up and running.

On macOS, you can use Homebrew to install PostgreSQL. Ideally, do not provide a password for the default superuser role.

```bash
brew install postgresql
brew services start postgresql
```

> On Windows, you will need to install PostgreSQL from [the website](https://www.postgresql.org) manually, and install it. Note that some of the `yarn db:xx` commands may not work on Windows, depending on how you've installed PostgreSQL.

Then, once in the project directory, run the following to set up the dependencies and migrate the database:

```bash
yarn install
yarn db:setup
```

> **Note:** If you have a pre-existing PostgreSQL installation, you should run `yarn db:reset` to ensure that there are no conflicts between role names and database names.

After the above commands succeed, you can build and start the application in production mode by issuing the following command:

```bash
yarn build
yarn start:prod
```

Congratulations! You can now access the application at [`http://localhost:3000`](http://localhost:3000).

## Development

During development, you may wish to make use of hot module reloading, in which case you can use the following command to start the server instead:

```bash
yarn start:dev
```

### Available commands

- `yarn start:dev` - Starts the app in development mode.
- `yarn start:prod` - Starts the app in production mode.
- `yarn build` - Builds the JavaScript bundles for production.
- `yarn db:user:create` - Creates the database user.
- `yarn db:create` - Creates the database.
- `yarn db:migrate` - Runs the migrations.
- `yarn db:setup` - Configures the database and user from scratch.
- `yarn db:drop` - Drops the database and user.
- `yarn db:reset` - Drops and recreates the database and user, and migrates the database.

## Screenshots

<img src="/media/1_login.png" />
<img src="/media/2_private_key.png" />
<img src="/media/3_new_conversation.png" />
<img src="/media/4_conversation.png" />
