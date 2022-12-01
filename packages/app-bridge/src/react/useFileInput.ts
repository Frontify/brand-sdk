/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useState } from 'react';

export type UseFileInputReturnTypes = [() => void, { selectedFiles: FileList | null }];
export type UseFileInputInterface = {
    accept?: string;
    multiple?: boolean;
};

export const useFileInput = ({ accept, multiple }: UseFileInputInterface): UseFileInputReturnTypes => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const onFileChange = (event: Event) => {
        if (event.target) {
            const files = (event.target as HTMLInputElement).files;
            setSelectedFiles(files);
        }
    };

    const openFileDialog = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        if (accept) {
            inputElement.accept = accept;
        }
        inputElement.multiple = !!multiple;
        inputElement.addEventListener('change', onFileChange);
        inputElement.dispatchEvent(new MouseEvent('click'));
    };

    return [openFileDialog, { selectedFiles }];
};
