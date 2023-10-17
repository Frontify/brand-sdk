/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { Card, LoadingCircle, LoadingCircleSize, LoadingCircleStyle, Stack, Text } from '@frontify/fondue';
import { PlatformAppContext, usePlatformAppBridge } from '@frontify/app-bridge';

type AssetResource = {
    type: string;
    id: string;
    title?: string;
    previewUrl?: string;
    downloadUrl?: string;
    filename?: string | null;
    sourceUrl?: string;
    html?: string;
};

export const App = () => {
    const appBridge = usePlatformAppBridge();

    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [assetRessources, setAssetRessources] = useState<AssetResource>();
    const [context, setContext] = useState<PlatformAppContext>();
    const [reUploadCounter, setReUploadCounter] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            if (!appBridge) {
                return;
            }

            const currentContext = appBridge.context().get();
            setContext(currentContext);

            if (currentContext?.type === 'ASSET_ACTION') {
                const assetRessources = await appBridge.api({
                    name: 'getAssetResourceInfo',
                    payload: { assetId: currentContext.assetId },
                });

                setAssetRessources(assetRessources);
                setImageSrc(assetRessources.previewUrl);
            }
        })();
    }, [appBridge]);

    const onButtonClick = async () => {
        if (!appBridge || !assetRessources?.downloadUrl) {
            return;
        }

        setUploading(true);
        await appBridge.api({
            name: 'createAsset',
            payload: {
                data: assetRessources.downloadUrl,
                filename: 'test.jpeg',
                parentId: appBridge?.context('parentId').get(),
            },
        });
        setReUploadCounter(reUploadCounter + 1);
        setUploading(false);
    };

    return (
        <div className="flex justify-center flex-col items-center h-[100vh]">
            <a href="https://developer.frontify.com" target="_blank" rel="noreferrer">
                Frontify
            </a>
            <div className="p-4">
                <Card>
                    <div className="flex flex-row items-center p-3">
                        <div className="w-[550px]">
                            <Stack spacing={8} padding={16} margin={4}>
                                <div className="self-center">
                                    <Text size="large">Frontify Platform Apps</Text>
                                </div>
                                <Text>
                                    <b>Entry Point</b>: {appBridge?.context('type').get()}
                                </Text>
                                <div>
                                    <Text>
                                        <b>Context</b>:
                                    </Text>{' '}
                                    {Object.keys(context ? context : []).map((item) => (
                                        <Text key={item}>{item} </Text>
                                    ))}
                                </div>
                            </Stack>
                        </div>
                        {imageSrc && <img src={imageSrc} alt="alt-title" className="h-36" />}
                    </div>
                </Card>
            </div>

            {context?.type === 'ASSET_ACTION' && (
                <button className="bg-black rounded py-1 px-3" onClick={onButtonClick}>
                    <div className="flex items-center text-white">
                        {reUploadCounter > 0 ? `re-uploaded ${reUploadCounter} times` : 'Reupload Image'}{' '}
                        {uploading && (
                            <div className="pl-2">
                                <LoadingCircle size={LoadingCircleSize.Small} style={LoadingCircleStyle.Progress} />
                            </div>
                        )}
                    </div>
                </button>
            )}
        </div>
    );
};
