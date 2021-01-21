# Frontify Block CLI

## Installation

```bash
npm install -g Frontify/frontify-block-cli
# Or
yarn global add Frontify/frontify-block-cli
```

## Commands

### Create a block

```bash
frontify-block-cli create <block name>
```

The block name needs to be lowercase, spaces are not allowed but you can use an underscore instead.

Example: `my_custom_block`

### Serve the block

```bash
frontify-block-cli serve
```

### Deploy a block

```bash
frontify-block-cli deploy <Frontify URL>
```

The Frontify URL represent your instance URL.

Example: `weare.frontify.com` or `https://weare.frontify.com`

## Authentification

### Login

```bash
frontify-block-cli login <Frontify URL>
```

The Frontify URL represent your instance URL.

Example: `weare.frontify.com` or `https://weare.frontify.com`

### Logout

```bash
frontify-block-cli logout
```

## Configuration

macOS: `~/Library/Preferences/frontify-block-cli-nodejs`
