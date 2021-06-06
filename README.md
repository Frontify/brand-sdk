# Frontify CLI

[![Continuous Integration](https://github.com/Frontify/frontify-cli/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/Frontify/frontify-cli/actions/workflows/continuous-integration.yml)

## Prerequisite

- Node >=14

## Installation

```bash
npm install -g @frontify/frontify-cli
# Or
yarn global add @frontify/frontify-cli
```

## Blocks

### Create

```bash
frontify-cli block create <block name>
```

The block name needs to be lowercase, spaces are not allowed but you can use an underscore instead.

Example: `my_custom_block`

### Serve

```bash
frontify-cli block serve
```

Params:
| Parameters | Description | Type | Default Value |
| ---------- | ----------- | ---- | ------------- |
| dir | Directory of the block | string | Current dir |
| entry | Path to the entry file | string | Entry `main` in package.json |
| port | Port for the local web server | string | 5600 |

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

### Logout

```bash
frontify-cli logout
```

## Configuration

macOS: `~/Library/Preferences/frontify-cli-nodejs`
