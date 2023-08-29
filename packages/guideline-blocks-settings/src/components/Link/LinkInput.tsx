/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock, AppBridgeTheme } from '@frontify/app-bridge';
import { ButtonSize, Checkbox, CheckboxState, FormControl, TextInput, TooltipPosition } from '@frontify/fondue';
import { LinkSelector } from './LinkSelector';
import { isValidUrlOrEmpty as internalIsValidUrlOrEmpty } from './utils';

type LinkInputProps = {
    url?: string;
    info?: string;
    label?: string;
    required?: boolean;
    newTab?: CheckboxState;
    openInNewTab?: boolean;
    onUrlChange?: (value: string) => void;
    onToggleTab?: (checked: boolean) => void;
    isValidUrlOrEmpty?: (url: string) => boolean;
    appBridge: AppBridgeBlock | AppBridgeTheme;
    clearable?: boolean;
    placeholder?: string;
    buttonSize?: ButtonSize;
    hideInternalLinkButton?: boolean;
};

export const LinkInput = ({
    onUrlChange,
    onToggleTab,
    isValidUrlOrEmpty,
    appBridge,
    clearable,
    placeholder,
    newTab,
    openInNewTab,
    url = '',
    required,
    info,
    label,
    buttonSize,
    hideInternalLinkButton,
}: LinkInputProps) => {
    const isUrlValid = isValidUrlOrEmpty ? isValidUrlOrEmpty(url) : internalIsValidUrlOrEmpty(url);
    const checkedState = newTab ?? (openInNewTab ? CheckboxState.Checked : CheckboxState.Unchecked);
    return (
        <div data-test-id="link-input">
            <FormControl
                label={{
                    children: label,
                    htmlFor: 'url',
                    required,
                    tooltip: info ? { content: info, position: TooltipPosition.Top } : undefined,
                }}
            >
                <TextInput
                    id="url"
                    value={url}
                    clearable={clearable}
                    onChange={onUrlChange}
                    placeholder={placeholder ?? 'https://example.com'}
                    focusOnMount
                />
            </FormControl>
            {!isUrlValid && <div className="tw-text-text-negative tw-mt-1 tw-text-s">Please enter a valid URL.</div>}

            {!hideInternalLinkButton && (
                <div className="tw-mt-3">
                    <LinkSelector
                        url={url}
                        appBridge={appBridge}
                        onUrlChange={onUrlChange}
                        buttonSize={buttonSize ?? ButtonSize.Medium}
                    />
                </div>
            )}

            <div className="tw-mt-3">
                <Checkbox value="new-tab" label="Open in new tab" state={checkedState} onChange={onToggleTab} />
            </div>
        </div>
    );
};
