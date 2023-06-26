/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { FileType } from '@frontify/app-bridge';

export type BlockInjectButtonProps = {
    isLoading?: boolean;
    label?: string;
    validFileType?: keyof typeof FileType;
    secondaryLabel?: string;
    icon?: JSX.Element;
    onDrop?: (files: FileList) => void;
    fillParentContainer?: boolean;
    onUploadClick?: () => void;
    onAssetChooseClick?: () => void;
    withMenu?: boolean;
    onClick?: () => void;
    verticalLayout?: boolean;
};
