/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { FormControl, TooltipPosition } from '@frontify/fondue';
import { TextInput, Checkbox, Label } from '@frontify/fondue/components';

import { LinkSelector } from './LinkSelector';
import { isValidUrlOrEmpty as internalIsValidUrlOrEmpty } from './utils';

type LinkInputProps = {
    url?: string;
    info?: string;
    label?: string;
    required?: boolean;
    newTab?: boolean;
    onUrlChange?: (value: string) => void;
    onToggleTab?: (checked: boolean) => void;
    isValidUrlOrEmpty?: (url: string) => boolean;
    appBridge: AppBridgeBlock;
    placeholder?: string;
    buttonSize?: 'small' | 'medium' | 'large';
    hideInternalLinkButton?: boolean;
};

export const LinkInput = ({
    onUrlChange,
    onToggleTab,
    isValidUrlOrEmpty,
    appBridge,
    placeholder,
    newTab,
    url = '',
    required,
    info,
    label,
    buttonSize,
    hideInternalLinkButton,
}: LinkInputProps) => {
    const isUrlValid = isValidUrlOrEmpty ? isValidUrlOrEmpty(url) : internalIsValidUrlOrEmpty(url);
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
                    data-test-id="text-input"
                    id="url"
                    value={url}
                    onChange={(event) => onUrlChange?.(event.target.value)}
                    placeholder={placeholder ?? 'https://example.com'}
                />
            </FormControl>
            {!isUrlValid && <div className="tw-text-text-negative tw-mt-1 tw-text-s">Please enter a valid URL.</div>}

            {!hideInternalLinkButton && (
                <div className="tw-mt-3">
                    <LinkSelector
                        url={url}
                        onUrlChange={onUrlChange}
                        buttonSize={buttonSize ?? 'medium'}
                        getAllDocuments={() => appBridge.getAllDocuments()}
                        getDocumentPagesByDocumentId={(documentId) =>
                            appBridge.getDocumentPagesByDocumentId(documentId)
                        }
                        getDocumentSectionsByDocumentPageId={(documentPageId) =>
                            appBridge.getDocumentSectionsByDocumentPageId(documentPageId)
                        }
                    />
                </div>
            )}

            <div className="tw-mt-3 tw-flex tw-items-center tw-gap-1.5">
                <Checkbox id="new-tab" value={newTab} onChange={() => onToggleTab?.(!newTab)} />
                <Label id="new-tab-label" htmlFor="new-tab">
                    Open in new tab
                </Label>
            </div>
        </div>
    );
};
