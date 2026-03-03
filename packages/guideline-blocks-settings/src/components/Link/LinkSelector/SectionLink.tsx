/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDocumentText } from '@frontify/fondue/icons';

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
            type="button"
            data-is-active={isActive}
            className={`
                tw-py-2 tw-pr-2.5 tw-pl-14 tw-leading-5 tw-cursor-pointer tw-w-full 
                ${
                    isActive
                        ? 'tw-bg-highlight tw-text-highlight-on-highlight hover:tw-bg-highlight-hover:hover hover:tw-text-highlight-on-highlight:hover'
                        : 'hover:tw-bg-container-secondary-hover hover:tw-text-container-secondary-on-secondary-container'
                }`}
            onClick={() => onSelectUrl(section.permanentLink)}
        >
            <div className="tw-flex tw-flex-1 tw-space-x-2 tw-items-center tw-h-6">
                <IconDocumentText size={16} />
                <span className="tw-text-small">{section.title}</span>
                <span className="tw-flex-auto tw-font-sans tw-text-x-small tw-text-right">Section</span>
            </div>
        </button>
    );
};
