/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDocumentText16, merge } from '@frontify/fondue';

type SectionLinkProps = {
    section: {
        id: number;
        title: string;
        permanentLink: string;
    };
    selectedUrl: string;
    onSelectUrl: (url: string) => void;
};

export const SectionLink = ({ section, selectedUrl, onSelectUrl }: SectionLinkProps) => {
    const isActive = section.permanentLink === selectedUrl;

    return (
        <button
            data-test-id="internal-link-selector-section-link"
            className={merge([
                'tw-py-2 tw-px-2.5 tw-pl-14 tw-leading-5 tw-cursor-pointer tw-w-full',
                isActive
                    ? 'tw-bg-box-selected-strong tw-text-box-selected-strong-inverse hover:tw-bg-box-selected-strong-hover:hover hover:tw-text-box-selected-strong-inverse-hover:hover'
                    : 'hover:tw-bg-box-neutral-hover hover:tw-text-box-neutral-inverse-hover',
            ])}
            onClick={() => onSelectUrl(section.permanentLink)}
        >
            <div className="tw-flex tw-flex-1 tw-space-x-2 tw-items-center tw-h-6">
                <IconDocumentText16 />
                <span className="tw-text-s">{section.title}</span>
                <span className="tw-flex-auto tw-font-sans tw-text-xs tw-text-right">Section</span>
            </div>
        </button>
    );
};
