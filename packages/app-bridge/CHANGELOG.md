# @frontify/app-bridge

## 3.5.5

### Patch Changes

- [#843](https://github.com/Frontify/brand-sdk/pull/843) [`3109e66`](https://github.com/Frontify/brand-sdk/commit/3109e66248fb9185c312d8170055452dce796bc4) Thanks [@julianiff](https://github.com/julianiff)! - chore: move up to v4

## 3.5.4

### Patch Changes

- [#821](https://github.com/Frontify/brand-sdk/pull/821) [`efde7a5`](https://github.com/Frontify/brand-sdk/commit/efde7a511b3d4fbbe17af5f0e41982d003743b35) Thanks [@imoutaharik](https://github.com/imoutaharik)! - feat(AppBridgePlatformApp): add the `proxyMethodCall` method

## 3.5.3

### Patch Changes

- [#834](https://github.com/Frontify/brand-sdk/pull/834) [`1612681`](https://github.com/Frontify/brand-sdk/commit/1612681472c6eff8b732aed10c33d0ac83269b83) Thanks [@anxobotana](https://github.com/anxobotana)! - feat: useTemplateAssets hook to return themeAsset as well

## 3.5.2

### Patch Changes

- [#825](https://github.com/Frontify/brand-sdk/pull/825) [`8430626`](https://github.com/Frontify/brand-sdk/commit/8430626870f7fb139d2b10b4f1f26040be1c6bbc) Thanks [@SamCreasey](https://github.com/SamCreasey)! - feat(AppBridgeBlock): add `isAuthenticated` to `BlockContext` type

## 3.5.1

### Patch Changes

- [#818](https://github.com/Frontify/brand-sdk/pull/818) [`c25d717`](https://github.com/Frontify/brand-sdk/commit/c25d71757e44406c065c65374d1d800a6d5694de) Thanks [@SamCreasey](https://github.com/SamCreasey)! - fix(useBlockSettings): `setBlockSettings` has been wrapped in a `useCallback` so it can be safely used as a dependency in react hooks. The following code will no longer cause unexpected rerenders.

  ```jsx
  const Component = () => {
    const [blockSettings, setBlockSettings] = useBlockSettings(appBridge);

    useEffect(() => {
      setBlockSettings({ ...blockSettings });
    }, [setBlockSettings]);
  };
  ```

## 3.5.0

### Minor Changes

- [#807](https://github.com/Frontify/brand-sdk/pull/807) [`909e0f5`](https://github.com/Frontify/brand-sdk/commit/909e0f5ef98e7bd1da6b0d96e32fdcde74a87d8d) Thanks [@anxobotana](https://github.com/anxobotana)! - feat: add navigateToDocumentSection command to AppBridgeTheme

### Patch Changes

- [#806](https://github.com/Frontify/brand-sdk/pull/806) [`5115dfd`](https://github.com/Frontify/brand-sdk/commit/5115dfda65ce87e53a26831e05034534d50a05be) Thanks [@anxobotana](https://github.com/anxobotana)! - fix: useGroupedDocuments and useUngroupedDocuments flaky tests

## 3.4.2

### Patch Changes

- [`babce0e`](https://github.com/Frontify/brand-sdk/commit/babce0eb251fa78ef9c7b4c2c0ce740c7d66718d) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Add the dist folder to published packages

## 3.4.1

### Patch Changes

- [`b0424c0`](https://github.com/Frontify/brand-sdk/commit/b0424c0a6dc1beef011c0d32124f53aed2e2a4b7) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Update dependencies

- [#776](https://github.com/Frontify/brand-sdk/pull/776) [`29ef8e1`](https://github.com/Frontify/brand-sdk/commit/29ef8e1e64a6372d580af06a86ef39ca2052662a) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Remove CJS to embrace ESM

## 3.4.0

### Minor Changes

- [#775](https://github.com/Frontify/brand-sdk/pull/775) [`3837782`](https://github.com/Frontify/brand-sdk/commit/383778258e862fb4fef62bf33aa71db71727aca1) Thanks [@mike85](https://github.com/mike85)! - feat: add open/close search dialog commands to AppBridgeTheme

## 3.3.2

### Patch Changes

- [#769](https://github.com/Frontify/brand-sdk/pull/769) [`dde3283`](https://github.com/Frontify/brand-sdk/commit/dde328355d240a730ba6a6d465166c0ecc773548) Thanks [@oliverschwendener](https://github.com/oliverschwendener)! - fix: document page duplication return type

## 3.3.1

### Patch Changes

- [#766](https://github.com/Frontify/brand-sdk/pull/766) [`3775b46`](https://github.com/Frontify/brand-sdk/commit/3775b4651b6d700e7179a360190a92e7f0fe51e6) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - Update dependencies

## 3.3.0

### Minor Changes

- [#730](https://github.com/Frontify/brand-sdk/pull/730) [`816751c`](https://github.com/Frontify/brand-sdk/commit/816751c66476dc85af09364344de23f8b5f68483) Thanks [@hochreutenerl](https://github.com/hochreutenerl)! - feat: adds `setAssetIdsByBlockAssetKey` to AppBridgeBlock

## 3.2.0

### Minor Changes

- [#731](https://github.com/Frontify/brand-sdk/pull/731) [`b9c4fc4`](https://github.com/Frontify/brand-sdk/commit/b9c4fc4fddacabb988ceb0cbe125c1793a697e19) Thanks [@anxobotana](https://github.com/anxobotana)! - feat: add theme template context to appBridgeThemes context

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
