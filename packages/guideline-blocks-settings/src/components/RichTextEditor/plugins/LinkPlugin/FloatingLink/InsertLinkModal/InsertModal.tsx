/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock } from '@frontify/app-bridge';
import {
    Button,
    ButtonEmphasis,
    ButtonSize,
    ButtonStyle,
    Checkbox,
    FormControl,
    IconCheckMark20,
    TextInput,
} from '@frontify/fondue';
import { FC, ReactNode } from 'react';
import { LinkSelector } from '../../../shared/LinkSelector';
import { InsertModalStateProps } from './types';

type InsertModalProps = {
    state: InsertModalStateProps;
    onTextChange: (value: string) => void;
    onUrlChange: (value: string) => void;
    onToggleTab: (checked: boolean) => void;
    onCancel: () => void;
    onSave: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent | undefined) => void;
    hasValues: boolean;
    isValidUrlOrEmpty: (url: string) => boolean | undefined;
    testId?: string;
    children?: ReactNode;
    appBridge: AppBridgeBlock;
};

export const InsertModal: FC<InsertModalProps> = ({
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
}) => (
    <div data-test-id={testId} className="tw-bg-white tw-rounded tw-shadow tw-p-7 tw-min-w-[400px] tw-overflow-y-auto">
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

        <div className="tw-pt-5">
            <FormControl
                label={{
                    children: 'URL',
                    htmlFor: 'url',
                    required: true,
                }}
            >
                <TextInput
                    id="url"
                    value={state.url}
                    placeholder="https://example.com"
                    focusOnMount
                    onChange={onUrlChange}
                />
            </FormControl>
            {!isValidUrlOrEmpty(state?.url) && <div className="tw-text-red-65 tw-mt-3">Please enter a valid URL.</div>}
        </div>

        <div className="tw-mt-3">
            <LinkSelector url={state.url} appBridge={appBridge} onUrlChange={onUrlChange} />
        </div>

        <div className="tw-mt-3">
            <Checkbox value="new-tab" label="Open in new tab" state={state.newTab} onChange={onToggleTab} />
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
                    disabled={!hasValues || !isValidUrlOrEmpty(state?.url)}
                >
                    Save
                </Button>
            </div>
        </div>
    </div>
);
