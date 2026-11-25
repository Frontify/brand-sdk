/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createStore } from '@frontify/fondue/rte';

export type FloatingButtonMode = '' | 'insert' | 'edit';

export const floatingButtonStore: any = createStore('floatingButton')({
    openEditorId: null as null | string,
    mouseDown: false,
    updated: false,
    url: '',
    text: '',
    buttonStyle: 'primary',
    newTab: false,
    mode: '',
    isEditing: false,
})
    .extendActions((set) => ({
        reset: () => {
            set.url('');
            set.text('');
            set.buttonStyle('primary');
            set.newTab(false);
            set.mode('');
            set.isEditing(false);
        },
    }))
    .extendActions((set) => ({
        show: (mode: FloatingButtonMode, editorId: string) => {
            set.mode(mode);
            set.isEditing(false);
            set.openEditorId(editorId);
        },
        hide: () => {
            set.reset();
            set.openEditorId(null);
        },
    }))
    .extendSelectors((state) => ({
        isOpen: (editorId: string) => state.openEditorId === editorId,
    }));

export const floatingButtonActions = floatingButtonStore.set;
export const floatingButtonSelectors = floatingButtonStore.get;
// oxlint-disable-next-line typescript/no-unsafe-return
export const useFloatingButtonSelectors = () => floatingButtonStore.use;
