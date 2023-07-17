/* (c) Copyright Frontify Ltd., all rights reserved. */

type AppBaseProps = {
    token: string;
};

export type PlatformAppContext = AppBaseProps &
    (
        | {
              assetId: string;
              parentId: string;
              directory: string; // JSON stringify
              domain: string;
              type: 'ASSET_ACTION';
              parameters: { [key: string]: unknown }[];
          }
        | {
              clientId: string;
              downloadUrl: string;
              projectId: number;
              type: 'ASSET_CREATION';
          }
    );
