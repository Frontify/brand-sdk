/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createStore } from '@frontify/fondue/rte';

import { type RichTextButtonStyle } from '../../types';

export type FloatingButtonMode = '' | 'insert' | 'edit';

export const floatingButtonStore: any = createStore('floatingButton')({
    openEditorId: null as null | string,
    mouseDown: false,
    updated: false,
    url: '',
    text: '',
    buttonStyle: 'primary' as RichTextButtonStyle,
    newTab: false,
    mode: '' as FloatingButtonMode,
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
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const useFloatingButtonSelectors = () => floatingButtonStore.use;
