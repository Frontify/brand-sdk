/* (c) Copyright Frontify Ltd., all rights reserved. */

declare global {
    interface Window {
        application: {
            sandbox: {
                config: {
                    context: {
                        project: {
                            id: number;
                        };
                    };
                };
            };
        };
    }
}

export {};
