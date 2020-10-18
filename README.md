# Dependency Tracker

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Configurations

You should have an `.env` variable in the root directory;

```
MONGO_URI=mongodb://localhost/test

REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_HOST=smtp.mailgun.org
SMTP_PORT=465
SMTP_IS_SECURE=TRUE
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM="Your Name" <name@mail.com>

CACHE_GITSERVER_TTL=600
CACHE_REGISTRY_TTL=600
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
