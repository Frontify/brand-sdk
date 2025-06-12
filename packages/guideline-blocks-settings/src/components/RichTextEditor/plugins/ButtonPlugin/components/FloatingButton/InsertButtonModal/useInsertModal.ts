/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { CheckboxState, getPluginOptions, useEditorRef, useHotkeys } from '@frontify/fondue';
import { type Dispatch, type Reducer, useEffect, useReducer } from 'react';

import { addHttps } from '../../../../../../../helpers';
import { isValidUrlOrEmpty } from '../../../../../../Link/utils/url';
import { ELEMENT_BUTTON } from '../../../createButtonPlugin';
import { submitFloatingButton } from '../../../transforms/submitFloatingButton';
import { type RichTextButtonStyle } from '../../../types';
import { getButtonStyle } from '../../../utils/getButtonStyle';
import { floatingButtonActions, floatingButtonSelectors } from '../floatingButtonStore';

import { type InsertModalDispatchType, type InsertModalStateProps } from './types';

const initialState: InsertModalStateProps = {
    url: '',
    text: '',
    buttonStyle: 'primary',
    newTab: CheckboxState.Unchecked,
};

export const InsertModalState = (): [InsertModalStateProps, Dispatch<InsertModalDispatchType>] => {
    const [state, dispatch] = useReducer<Reducer<InsertModalStateProps, InsertModalDispatchType>>((state, action) => {
        const { type, payload } = action;

        switch (type) {
            case 'NEW_TAB':
                return {
                    ...state,
                    newTab: CheckboxState.Checked,
                };
            case 'SAME_TAB':
                return {
                    ...state,
                    newTab: CheckboxState.Unchecked,
                };
            case 'URL':
            case 'TEXT':
            case 'BUTTON_STYLE':
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
        const buttonStyle = getButtonStyle(editor);

        dispatch({
            type: 'INIT',
            payload: {
                text: floatingButtonSelectors.text() || floatingButtonSelectors.url(),
                buttonStyle,
                newTab: floatingButtonSelectors.newTab() ? CheckboxState.Checked : CheckboxState.Unchecked,
                url: floatingButtonSelectors.url(),
            },
        });
    }, [dispatch, editor]);

    const onTextChange = (value: string) => {
        dispatch({
            type: 'TEXT',
            payload: { text: value },
        });
    };

    const onButtonStyleChange = (value: RichTextButtonStyle) => {
        dispatch({
            type: 'BUTTON_STYLE',
            payload: { buttonStyle: value },
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
        floatingButtonActions.reset();
    };

    const onSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent | undefined) => {
        if (!isValidUrlOrEmpty(state.url) || !hasValues) {
            return;
        }

        const urlToSave = addHttps(state.url);

        floatingButtonActions.text(state.text);
        floatingButtonActions.url(urlToSave);
        floatingButtonActions.buttonStyle(state.buttonStyle);
        floatingButtonActions.newTab(state.newTab === CheckboxState.Checked);

        if (submitFloatingButton(editor)) {
            event?.preventDefault();
        }
    };

    const hasValues = state.url !== '' && state.text !== '';

    const { appBridge } = getPluginOptions<{ appBridge: AppBridgeBlock }>(editor, ELEMENT_BUTTON);

    useHotkeys(
        'enter',
        onSave,
        {
            enableOnFormTags: ['INPUT'],
        },
        [],
    );

    return {
        state,
        onTextChange,
        onButtonStyleChange,
        onUrlChange,
        onToggleTab,
        onCancel,
        onSave,
        hasValues,
        isValidUrlOrEmpty,
        appBridge,
    };
};
