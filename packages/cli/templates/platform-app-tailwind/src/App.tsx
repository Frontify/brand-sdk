/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useGetQuery, usePlatformContext } from '@frontify/app-bridge';
import React, { useState } from 'react';
import { getCurrentProjectAssets, getCurrentUser } from './api/graphql';
import { Asset, OpenAiImage, ProjectAssetResponse } from './type/Project';
import { User } from './type/User';
import { Button, ButtonRounding, ButtonSize, Stack, TextInput, TextInputType } from '@frontify/fondue';
import { Frontify } from './api/upload';

export const App = () => {
    const { view, projectId, token } = usePlatformContext();
    // Here we have a curried function
    const getData = useGetQuery();

    // Return an instance of a getter
    const [user, setUser] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [images, setImages] = useState<Asset[]>();
    const [openAiInput, setOpenAiInput] = useState<string>();
    const [openAiPictures, setOpenAiPictures] = useState<OpenAiImage[]>();

    const showUserData = async () => {
        const response = await getData<User>(getCurrentUser);
        setUser(response.data.currentUser.name);
        setEmail(response.data.currentUser.email);
    };

    const showWorkspaceData = async () => {
        if (projectId) {
            const response = await getData<ProjectAssetResponse>(getCurrentProjectAssets(projectId));
            setImages(response.data.workspaceProject.assets.items);
        }
    };

    const generateImages = async () => {
        const openai_endpoing = 'https://api.openai.com/v1/images/generations';
        const body = {
            prompt: openAiInput,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        };
        const response = await fetch(openai_endpoing, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer <Bearer>',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const output = await response.json();
        setOpenAiPictures(output.data);
    };

    return (
        <div>
            <Stack spacing={'m'} padding={'m'} direction={'column'}>
                <p>Current View: {view}</p>
                <p>Current Project: {projectId}</p>
                <p>{user && user}</p>
                <p>{email && email}</p>

                <Stack spacing={'m'} padding={'none'}>
                    <Button rounding={ButtonRounding.Medium} size={ButtonSize.Medium} onClick={() => showUserData()}>
                        Show Current User
                    </Button>
                    <Button
                        rounding={ButtonRounding.Medium}
                        size={ButtonSize.Medium}
                        onClick={() => showWorkspaceData()}
                    >
                        Display Current Project Images
                    </Button>
                </Stack>
                <Stack spacing={'m'} padding={'none'}>
                    {images && images.map((item) => <img key={item.id} src={item.previewUrl} style={{ width: 250 }} />)}
                </Stack>
                <Stack spacing={'m'} padding={'none'}>
                    <TextInput
                        onChange={(value) => setOpenAiInput(value)}
                        spellcheck
                        type={TextInputType.Text}
                        value={openAiInput}
                    />
                    <Button rounding={ButtonRounding.Medium} size={ButtonSize.Medium} onClick={() => generateImages()}>
                        Generate New Images
                    </Button>
                </Stack>
                <Stack spacing={'m'} padding={'none'}>
                    {openAiPictures &&
                        openAiPictures.map((item, index) => (
                            <img key={index} src={`data:image/png;base64,${item.b64_json}`} style={{ width: 250 }} />
                        ))}
                </Stack>
                <Stack spacing={'m'} padding={'none'}>
                    {openAiPictures && (
                        <Button
                            rounding={ButtonRounding.Medium}
                            size={ButtonSize.Medium}
                            onClick={() => {
                                Frontify.uploadToLibrary(
                                    [''],
                                    openAiPictures.map((item) => ({
                                        b64_json: `data:image/png;base64,${item.b64_json}`,
                                    })),
                                    window.btoa(
                                        unescape(encodeURIComponent(`{"identifier":${projectId},"type":"project"}`))
                                    ),
                                    () => console.log('uploaded'),
                                    (output) => console.log(output),
                                    (err) => console.warn(err),
                                    token
                                );
                            }}
                        >
                            Upload
                        </Button>
                    )}
                </Stack>
            </Stack>
        </div>
    );
};
