# Frontify CLI

[![Continuous Integration](https://github.com/Frontify/frontify-cli/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/Frontify/frontify-cli/actions/workflows/continuous-integration.yml)

## Prerequisite

-   Node >=16

## Installation

```bash
npm install -g @frontify/frontify-cli
# Or
yarn global add @frontify/frontify-cli
```

## Content Block

### Create

```bash
npx @frontify/frontify-cli block create <app name>
```

The content block name needs to be lowercase, spaces are not allowed but you can use an underscore instead.

Example: `my_custom_content_block`

### Serve

```bash
frontify-cli block serve
```

Params:
| Parameters | Description | Type | Default Value |
| ---------- | ----------- | ---- | ------------- |
| entryPath | Path to the entry file exporting `block` and `settings` | string | `src/index.tsx` |
| port | Port for the local development server | number | 5600 |

### Deploy

```bash
frontify-cli block deploy --instance=<Frontify URL>
```

The Frontify URL represent your instance URL.

Example: `weare.frontify.com` or `https://weare.frontify.com`

## Authentification

### Login

```bash
frontify-cli login --instance=<Frontify URL>
```

The Frontify URL represent your instance URL.

Example: `weare.frontify.com` or `https://weare.frontify.com`

If you are using a domain with self-signed certificate, you will need to put `NODE_TLS_REJECT_UNAUTHORIZED=0` before the log in command

### Logout

```bash
frontify-cli logout
```

## Configuration

macOS: `~/Library/Preferences/frontify-cli-nodejs`
