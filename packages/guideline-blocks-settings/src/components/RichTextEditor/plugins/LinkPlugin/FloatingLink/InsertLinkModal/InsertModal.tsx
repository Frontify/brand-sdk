/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import {
    Button,
    ButtonEmphasis,
    ButtonSize,
    ButtonStyle,
    FloatingModalWrapper,
    FormControl,
    IconCheckMark20,
    TextInput,
} from '@frontify/fondue';
import { type MouseEvent, type ReactElement, type ReactNode } from 'react';

import { LinkInput } from '../../../../../Link';

import { type InsertModalStateProps } from './types';

type Props = {
    state: InsertModalStateProps;
    onTextChange: (value: string) => void;
    onUrlChange: (value: string) => void;
    onToggleTab: (checked: boolean) => void;
    onCancel: () => void;
    onSave: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | KeyboardEvent | undefined) => void;
    hasValues: boolean;
    isValidUrlOrEmpty: (url: string) => boolean;
    testId?: string;
    children?: ReactNode;
    appBridge: AppBridgeBlock;
};

export const InsertModal = ({
    state,
    onTextChange,
    onUrlChange,
    onToggleTab,
    onCancel,
    onSave,
    isValidUrlOrEmpty,
    hasValues,
    testId,
    appBridge,
    children,
}: Props): ReactElement => (
    <FloatingModalWrapper data-test-id={testId} padding="28px" minWidth="400px">
        <FormControl
            label={{
                children: 'Text',
                htmlFor: 'linkText',
                required: true,
            }}
        >
            <TextInput id="linkText" value={state.text} placeholder="Link Text" onChange={onTextChange} />
        </FormControl>

        {children}

        <div className="tw-mt-5">
            <LinkInput
                url={state.url}
                newTab={state.newTab}
                onUrlChange={onUrlChange}
                onToggleTab={onToggleTab}
                isValidUrlOrEmpty={isValidUrlOrEmpty}
                appBridge={appBridge}
            />
        </div>
        <div className="tw-mt-3">
            <div className={'tw-pt-5 tw-flex tw-gap-x-3 tw-justify-end tw-border-t tw-border-t-black-10'}>
                <Button
                    onClick={onCancel}
                    size={ButtonSize.Medium}
                    style={ButtonStyle.Default}
                    emphasis={ButtonEmphasis.Default}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    size={ButtonSize.Medium}
                    icon={<IconCheckMark20 />}
                    disabled={!isValidUrlOrEmpty(state?.url) || !hasValues}
                >
                    Save
                </Button>
            </div>
        </div>
    </FloatingModalWrapper>
);
