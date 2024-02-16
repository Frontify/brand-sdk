# @frontify/app-bridge

## 4.0.0-alpha.2

### Patch Changes

-   [#753](https://github.com/Frontify/brand-sdk/pull/753) [`50937f2`](https://github.com/Frontify/brand-sdk/commit/50937f2170f5ee1eab05726e141fc0e932f71865) Thanks [@ragi96](https://github.com/ragi96)! - feat: adds `setAssetIdsByBlockAssetKey` to AppBridgeBlock

## 4.0.0-alpha.1

### Patch Changes

-   [#742](https://github.com/Frontify/brand-sdk/pull/742) [`5ea66a7`](https://github.com/Frontify/brand-sdk/commit/5ea66a79bac131f5b34f1a1bf60fbe81add6b17f) Thanks [@anxobotana](https://github.com/anxobotana)! - feat: add context.template to AppBridgeTheme

## 3.3.0

### Minor Changes

- [#730](https://github.com/Frontify/brand-sdk/pull/730) [`816751c`](https://github.com/Frontify/brand-sdk/commit/816751c66476dc85af09364344de23f8b5f68483) Thanks [@hochreutenerl](https://github.com/hochreutenerl)! - feat: adds `setAssetIdsByBlockAssetKey` to AppBridgeBlock

## 3.2.0

### Minor Changes

- [#731](https://github.com/Frontify/brand-sdk/pull/731) [`b9c4fc4`](https://github.com/Frontify/brand-sdk/commit/b9c4fc4fddacabb988ceb0cbe125c1793a697e19) Thanks [@anxobotana](https://github.com/anxobotana)! - feat: add theme template context to appBridgeThemes context

## 4.0.0-alpha.0

### Major Changes

- [#705](https://github.com/Frontify/brand-sdk/pull/705) [`a027b87`](https://github.com/Frontify/brand-sdk/commit/a027b87593ae25d18cda62c4989920a16958d28c) Thanks [@ragi96](https://github.com/ragi96)! - feat: first alpha release, removes all deprecated functions on the AppBridgeBlock

## 3.1.0

### Minor Changes

- [#714](https://github.com/Frontify/brand-sdk/pull/714) [`68a9298`](https://github.com/Frontify/brand-sdk/commit/68a9298df9e2177e70333f47dc433a056d76625b) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Split the testing utilities out of the main bundle, so they don't end up in production builds.
  You will need to update the import paths in your tests:

  ```git
  - import { AssetDummy, withAppBridgeBlockStubs } from '@frontify/app-bridge';
  + import { AssetDummy, withAppBridgeBlockStubs } from '@frontify/app-bridge/testing';
  ```

## 3.0.4

### Patch Changes

- [#713](https://github.com/Frontify/brand-sdk/pull/713) [`c98d8c4`](https://github.com/Frontify/brand-sdk/commit/c98d8c414b2cdd00d4945f0c29581370b0a7daa0) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Add typing for package.json

## 3.0.3

### Patch Changes

- [#711](https://github.com/Frontify/brand-sdk/pull/711) [`6672186`](https://github.com/Frontify/brand-sdk/commit/6672186580907a4ef74870696bb3720da1390f30) Thanks [@julianiff](https://github.com/julianiff)! - refactor: change variable order

## 3.0.2

### Patch Changes

- [#680](https://github.com/Frontify/brand-sdk/pull/680) [`3fa74ba`](https://github.com/Frontify/brand-sdk/commit/3fa74badfedd8c52661f23e0528dc35d8a10062d) Thanks [@ragi96](https://github.com/ragi96)! - chore: replace usage of deprecated appBridgeBlock functions

## 3.0.1

### Patch Changes

- [`a2b2ee7`](https://github.com/Frontify/brand-sdk/commit/a2b2ee78b8df136c823a3603c284aba4db08bbf7) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Change Theme Settings to be Theme Template Settings

## 3.0.0

### Major Changes

- [#620](https://github.com/Frontify/brand-sdk/pull/620) [`728cfd9`](https://github.com/Frontify/brand-sdk/commit/728cfd9e16a5c286fda4b2ae31dd96118c811929) Thanks [@ragi96](https://github.com/ragi96)! - chore: stable version release

## 3.0.0-beta.32

### Patch Changes

- [`3205f68`](https://github.com/Frontify/brand-sdk/commit/3205f682dbe0080dd2a00abee5e785f87d014f0d) Thanks [@GoranRibic](https://github.com/GoranRibic)! - Added more guideline actions

## 3.0.0-beta.31

### Minor Changes

- Add Brandportal link
