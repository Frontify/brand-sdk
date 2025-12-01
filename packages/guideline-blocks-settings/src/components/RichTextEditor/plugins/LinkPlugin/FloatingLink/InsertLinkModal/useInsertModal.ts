/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import {
    ELEMENT_LINK,
    floatingLinkActions,
    floatingLinkSelectors,
    getPluginOptions,
    submitFloatingLink,
    useEditorRef,
    useHotkeys,
} from '@frontify/fondue/rte';
import { type Dispatch, type MouseEvent, type Reducer, useEffect, useReducer } from 'react';

import { addHttps } from '../../../../../../helpers';
import { isValidUrlOrEmpty } from '../../../../../Link';
import { getLegacyUrl, getUrl } from '../../utils';

import { type InsertModalDispatchType, type InsertModalStateProps } from './types';

const initialState: InsertModalStateProps = {
    url: '',
    text: '',
    newTab: false,
};

export const InsertModalState = (): [InsertModalStateProps, Dispatch<InsertModalDispatchType>] => {
    const [state, dispatch] = useReducer<Reducer<InsertModalStateProps, InsertModalDispatchType>>((state, action) => {
        const { type, payload } = action;

        switch (type) {
            case 'NEW_TAB':
                return {
                    ...state,
                    newTab: true,
                };
            case 'SAME_TAB':
                return {
                    ...state,
                    newTab: false,
                };
            case 'URL':
            case 'TEXT':
            case 'INIT':
                return {
                    ...state,
                    ...payload,
                };
            default:
                return state;
        }
    }, initialState);

    return [state, dispatch];
};

export const useInsertModal = () => {
    const editor = useEditorRef();
    const [state, dispatch] = InsertModalState();

    useEffect(() => {
        const legacyUrl = getLegacyUrl(editor);
        const url = getUrl(editor);
        const isNewTab = floatingLinkSelectors.newTab();
        dispatch({
            type: 'INIT',
            payload: {
                text: floatingLinkSelectors.text() || floatingLinkSelectors.url(),
                newTab: isNewTab,
                url: legacyUrl && url === '' ? legacyUrl : floatingLinkSelectors.url(),
            },
        });
    }, [dispatch, editor]);

    const onTextChange = (value: string) => {
        dispatch({
            type: 'TEXT',
            payload: { text: value },
        });
    };

    const onUrlChange = (value: string) => {
        dispatch({
            type: 'URL',
            payload: { url: value },
        });
    };

    const onToggleTab = (checked: boolean) => {
        checked ? dispatch({ type: 'NEW_TAB' }) : dispatch({ type: 'SAME_TAB' });
    };

    const onCancel = () => {
        floatingLinkActions.reset();
    };

    const onSave = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | KeyboardEvent | undefined) => {
        if (!isValidUrlOrEmpty(state.url) || !hasValues) {
            return;
        }

        floatingLinkActions.text(state.text);
        floatingLinkActions.url(addHttps(state.url));
        floatingLinkActions.newTab(state.newTab);

        if (submitFloatingLink(editor)) {
            event?.preventDefault();
        }
    };

    const hasValues = state.url !== '' && state.text !== '';

    const { appBridge } = getPluginOptions<{ appBridge: AppBridgeBlock }>(editor, ELEMENT_LINK);

    useHotkeys(
        'enter',
        onSave,
        {
            enableOnFormTags: ['INPUT'],
        },
        [],
    );

    return { state, onTextChange, onUrlChange, onToggleTab, onCancel, onSave, hasValues, isValidUrlOrEmpty, appBridge };
};
