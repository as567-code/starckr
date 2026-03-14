# aditya-app

A personal full-stack TypeScript starter built on the MERN stack (MongoDB, Express, React, Node.js). Designed as a production-ready foundation with authentication, authorization, and tooling already wired up.

## Features

- Session-based authentication with [Passport.js](https://www.passportjs.org)
- Email verification and password reset via [SendGrid](https://sendgrid.com)
- Admin dashboard for user management (view, delete, promote users)
- Role-based access control (RBAC)
- Dark/light mode UI built with [Material UI](https://mui.com)
- Comprehensive test coverage: [Jest](https://jestjs.io) + [Supertest](https://www.npmjs.com/package/supertest) (backend), [Vitest](https://vitest.dev) (frontend), [Playwright](https://playwright.dev) (e2e)
- AirBnb TypeScript style enforced with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- Pre-commit hooks via [Husky](https://typicode.github.io/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- CI with GitHub Actions (lint + test on every push)

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18+)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

Install all dependencies from the repo root:

```bash
yarn setup
```

### MongoDB Atlas

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
2. Create a cluster and obtain the connection URI.
3. Add the URI to your `.env` (see Environment Variables below).

[MongoDB Compass](https://www.mongodb.com/docs/compass/current/) is recommended for local data inspection.

### SendGrid

1. Create a [SendGrid](https://sendgrid.com) account.
2. Register a [Sender Identity](https://docs.sendgrid.com/for-developers/sending-email/sender-identity).
3. Generate an [API key](https://docs.sendgrid.com/ui/account-and-settings/api-keys#creating-an-api-key).

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
ATLAS_URI=your-mongodb-atlas-connection-uri
COOKIE_SECRET=any-random-string
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_EMAIL_ADDRESS=your-verified-sender-email
```

## Usage

All commands are run from the repo root.

```bash
# Start both server and client in development mode
yarn dev

# Run server only
yarn server

# Run client only
yarn client

# Run all tests
yarn test

# Lint and auto-fix
yarn lint

# Format with Prettier
yarn format
```

## Deployment (WIP)

The app is configured for deployment on [AWS ECS](https://aws.amazon.com/ecs/) using [Terraform](https://www.terraform.io).

1. [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) (Homebrew recommended on macOS).
2. Copy `.auto.tfvars.example` to `.auto.tfvars` and fill in the values (mirrors the server `.env`, plus `aws_account_id`).
3. Deploy:

```bash
./deploy.sh
```

4. Tear down infrastructure:

```bash
terraform destroy
```
