# @frontify/app-bridge

## 3.12.0

### Minor Changes

- [#1346](https://github.com/Frontify/brand-sdk/pull/1346) [`47eaab2`](https://github.com/Frontify/brand-sdk/commit/47eaab210961db1eeb01cb3da2ff7d623a5b07a2) Thanks [@findmind](https://github.com/findmind)! - refactor(TemplateApiLegacy): removed unused `token`, `unit` and `sector`

## 3.11.2

### Patch Changes

- [#1282](https://github.com/Frontify/brand-sdk/pull/1282) [`7363adb`](https://github.com/Frontify/brand-sdk/commit/7363adbb2d32b0bca189e439956609a355483382) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - chore: update dependencies

## 3.11.1

### Patch Changes

- [#1154](https://github.com/Frontify/brand-sdk/pull/1154) [`a8f1726`](https://github.com/Frontify/brand-sdk/commit/a8f1726a344be12fe32fe2caee8355a6aeeea15b) Thanks [@mikeyrayvon](https://github.com/mikeyrayvon)! - fix(templates): prevent delete on update without existing template ids

- [#1158](https://github.com/Frontify/brand-sdk/pull/1158) [`8937b15`](https://github.com/Frontify/brand-sdk/commit/8937b15b6dfcf17c288f4b22643c991ae74d55a4) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - fix: do not hardcode upload chunk sizes

## 3.11.0

### Minor Changes

- [#1136](https://github.com/Frontify/brand-sdk/pull/1136) [`6bafe6c`](https://github.com/Frontify/brand-sdk/commit/6bafe6c0aadc0dcba8a8b3c7bb283e219c47b5ef) Thanks [@ragi96](https://github.com/ragi96)! - refactor(AssetChooserType): remove PatternLibrary as it is sunset
  refactor(DocumentMode): remove PatternLibrary as it is sunset

## 3.10.1

### Patch Changes

- [#1013](https://github.com/Frontify/brand-sdk/pull/1013) [`4f0f660`](https://github.com/Frontify/brand-sdk/commit/4f0f6603f9c3f65598ccbf5c81d3c4b02f732533) Thanks [@hochreutenerl](https://github.com/hochreutenerl)! - refactor: remove change_properties from `Document` and `DocumentPage`

## 3.10.0

### Minor Changes

- [#980](https://github.com/Frontify/brand-sdk/pull/980) [`bf9529d`](https://github.com/Frontify/brand-sdk/commit/bf9529d50ef1d31ad147b08d52009e2d2df6f289) Thanks [@bojangles-m](https://github.com/bojangles-m)! - feat: added additional prop `guideline_title` to the `GuidelineSearchResultApi`.

## 3.9.2

### Patch Changes

- [#950](https://github.com/Frontify/brand-sdk/pull/950) [`d938929`](https://github.com/Frontify/brand-sdk/commit/d9389295b856b93d73e5defdd2a347964e1b5377) Thanks [@hochreutenerl](https://github.com/hochreutenerl)! - fix: remove unused properties from `DocumentSectionApi`

## 3.9.1

### Patch Changes

- [#920](https://github.com/Frontify/brand-sdk/pull/920) [`c2477e7`](https://github.com/Frontify/brand-sdk/commit/c2477e76f7c221ae5435c783f3ef85ceb6295ca0) Thanks [@fulopdaniel](https://github.com/fulopdaniel)! - feat(assetViewer): add isDownloadable option to asset viewer

## 3.9.0

### Minor Changes

- [#921](https://github.com/Frontify/brand-sdk/pull/921) [`17af9f1`](https://github.com/Frontify/brand-sdk/commit/17af9f135a85b55f7e7757a112adf34125d03502) Thanks [@ragi96](https://github.com/ragi96)! - feat: add `ìsDownloadProtected` to the `Asset`

## 3.8.0

### Minor Changes

- [#909](https://github.com/Frontify/brand-sdk/pull/909) [`14b9fdf`](https://github.com/Frontify/brand-sdk/commit/14b9fdfb5bc58b482350109d1eee1a8c4ff942d6) Thanks [@SamCreasey](https://github.com/SamCreasey)! - feat(useAfterInsertion): A new hook to execute a callback after a block has been inserted, can be used to focus a specific element for faster editing. The callback is only executed when the third argument is true (default). This hook is only usable with instances of AppBridgeBlock.

    ```jsx
    const ExampleBlock = ({ appBridge }: BlockProps) => {
      const buttonRef = useRef<HTMLButtonElement>(null);
      const [data, setData] = useState(null);
      const hasData = data !== null;

      useEffect(() => {
        getAsyncData().then((data) => setData(data));
      }, []);

      useAfterInsertion(appBridge, () => buttonRef.current?.focus(), hasData);

      return hasData ?
        <button ref={buttonRef} onClick={() => console.log("Creating new item...")}>Create New Item</button> :
        <div>Loading...</div>;
    };
    ```

## 3.7.0

### Minor Changes

- [#912](https://github.com/Frontify/brand-sdk/pull/912) [`fa18d35`](https://github.com/Frontify/brand-sdk/commit/fa18d35a554f32d561d7ed33d3e2e5fa3fb90a89) Thanks [@bojangles-m](https://github.com/bojangles-m)! - feat: added additional prop `project_color_id` to the `GuidelineSearchResultApi`.

### Patch Changes

- [#913](https://github.com/Frontify/brand-sdk/pull/913) [`bf41e48`](https://github.com/Frontify/brand-sdk/commit/bf41e480d93b75084deee811099cc3ea094696fb) Thanks [@ragi96](https://github.com/ragi96)! - feat: adds nullable `backgroundColor` to the `asset`

## 3.6.3

### Patch Changes

- [#903](https://github.com/Frontify/brand-sdk/pull/903) [`b8c5bb7`](https://github.com/Frontify/brand-sdk/commit/b8c5bb7156a58f6fa020dd56fa1cb6a016440666) Thanks [@Kenny806](https://github.com/Kenny806)! - feat(AppBridgeTheme): add isSearchDialogOpen to context

## 3.6.2

### Patch Changes

- [#892](https://github.com/Frontify/brand-sdk/pull/892) [`fe3323c`](https://github.com/Frontify/brand-sdk/commit/fe3323ccb4c6b9c18bc5eee9564b3468e645fa4d) Thanks [@ragi96](https://github.com/ragi96)! - chore: bump `vite` to `5.2.10`

## 3.6.1

### Patch Changes

- [#882](https://github.com/Frontify/brand-sdk/pull/882) [`f6897fb`](https://github.com/Frontify/brand-sdk/commit/f6897fb6b758c03053fcf88805f100c3c0b33d1e) Thanks [@oliverschwendener](https://github.com/oliverschwendener)! - fix(useDocumentNavigation): Fixed an issue that prevented debounced callbacks not to be executed
  fix(usePortalNavigation): Fixed an issue that prevented debounced callbacks not to be executed

## 3.6.0

### Minor Changes

- [#871](https://github.com/Frontify/brand-sdk/pull/871) [`cc7532a`](https://github.com/Frontify/brand-sdk/commit/cc7532ae5a3803f12997887e9f1ca9993e9f8e7c) Thanks [@ryancarville](https://github.com/ryancarville)! - feat(AppBridgeBlock): adds `creationFormUri` to the type `template`

## 3.5.9

### Patch Changes

- [#875](https://github.com/Frontify/brand-sdk/pull/875) [`d74dc90`](https://github.com/Frontify/brand-sdk/commit/d74dc90501cd0aac39f67a834014fd9c261abfb0) Thanks [@anxobotana](https://github.com/anxobotana)! - feat(usePageTemplateSettings): returns also templateThemeSettings

## 3.5.8

### Patch Changes

- [#868](https://github.com/Frontify/brand-sdk/pull/868) [`88fb3c3`](https://github.com/Frontify/brand-sdk/commit/88fb3c3b0235d9fc89c9a352273bacfaf53fdb0e) Thanks [@mike85](https://github.com/mike85)! - feat(AppBridgeTheme): add useDocumentNavigation hook

## 3.5.7

### Patch Changes

- [#856](https://github.com/Frontify/brand-sdk/pull/856) [`b2060ff`](https://github.com/Frontify/brand-sdk/commit/b2060ff02448ca127c34d0745f363ff8bd06ec77) Thanks [@anxobotana](https://github.com/anxobotana)! - feat(AppBridgeTheme): add usePortalNavigation hook

## 3.5.6

### Patch Changes

- [#853](https://github.com/Frontify/brand-sdk/pull/853) [`d980eb3`](https://github.com/Frontify/brand-sdk/commit/d980eb367062b4c4cd6416f852408da4f13c74ab) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - chore: update eslint and lint fix all files

- [#855](https://github.com/Frontify/brand-sdk/pull/855) [`bcfe9ab`](https://github.com/Frontify/brand-sdk/commit/bcfe9abea8872b8341b053159827a953bdbea16c) Thanks [@SamuelAlev](https://github.com/SamuelAlev)! - chore: bump dependencies

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
