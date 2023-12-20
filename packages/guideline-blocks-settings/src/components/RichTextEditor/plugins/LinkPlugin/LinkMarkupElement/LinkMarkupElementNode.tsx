/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type HTMLPropsAs, type LinkRootProps, useElementProps } from '@udecode/plate';
import { type MouseEvent } from 'react';

import { BlockStyles } from '../../styles';
import { LINK_PLUGIN } from '../id';
import { type TLinkElement } from '../types';

const useLink = (props: LinkRootProps): HTMLPropsAs<'a'> => {
    const _props = useElementProps<TLinkElement, 'a'>({
        ...props,
        elementToAttributes: (element) => ({
            href: element.url || element.chosenLink?.searchResult?.link || '',
            target: element.target || '_self',
        }),
    });

    return {
        ..._props,
        // quick fix: hovering <a> with href loses the editor focus
        onMouseOver: (event: MouseEvent) => {
            event.stopPropagation();
        },
    };
};

export const LinkMarkupElementNode = (props: LinkRootProps) => {
    const htmlProps = useLink(props);
    const { attributes, children } = props;

    return (
        <a {...attributes} href={htmlProps.href} target={htmlProps.target} style={BlockStyles[LINK_PLUGIN]}>
            {children}
        </a>
    );
};
