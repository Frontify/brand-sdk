# App Bridge

Establishes the communication between Frontify and the blocks and apps that run inside it.

A block receives an `AppBridgeBlock` from its host. Through it you read the block's settings, assets and
context, dispatch commands such as opening a chooser, and call API methods such as creating assets. The
React hooks wrap the same bridge and re-render your block when what they read changes.

## Example

```tsx
/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type AppBridgeBlock,
    useAssetChooser,
    useBlockAssets,
    useBlockSettings,
    useEditorState,
} from '@frontify/app-bridge';

type Settings = { caption: string };

const IMAGE_KEY = 'image';

export const ExampleBlock = ({ appBridge }: { appBridge: AppBridgeBlock }) => {
    const [settings, setSettings] = useBlockSettings<Settings>(appBridge);
    const { blockAssets, updateAssetIdsFromKey } = useBlockAssets(appBridge);
    const { openAssetChooser, closeAssetChooser } = useAssetChooser(appBridge);
    const isEditing = useEditorState(appBridge);

    const [image] = blockAssets[IMAGE_KEY] ?? [];

    const chooseImage = () => {
        openAssetChooser(
            async (assets) => {
                await updateAssetIdsFromKey(
                    IMAGE_KEY,
                    assets.map(({ id }) => id),
                );
                closeAssetChooser();
            },
            { multiSelection: false },
        );
    };

    return (
        <figure>
            {image ? <img src={image.previewUrl} alt={image.title} /> : null}
            {isEditing ? (
                <>
                    <button onClick={chooseImage}>Choose an image</button>
                    <input
                        value={settings.caption ?? ''}
                        onChange={(event) => setSettings({ caption: event.target.value })}
                    />
                </>
            ) : (
                <figcaption>{settings.caption}</figcaption>
            )}
        </figure>
    );
};
```

## Testing

`@frontify/app-bridge/testing` provides a stubbed bridge and dummies for your block's tests.

```tsx
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetDummy, withAppBridgeBlockStubs } from '@frontify/app-bridge/testing';

const [ExampleBlockWithStubs] = withAppBridgeBlockStubs(ExampleBlock, {
    blockAssets: { image: [AssetDummy.with(1)] },
});
```

## Migrating from 3.x

Version 4 replaces the per-method bridge with the command, event and API registries, and moves the
block's settings, assets, templates and privacy settings into its context. The hooks read from the
context, so they re-render when the host changes what they read.

[CHANGELOG.md](./CHANGELOG.md) lists every change, including the removals and the replacement for each.
