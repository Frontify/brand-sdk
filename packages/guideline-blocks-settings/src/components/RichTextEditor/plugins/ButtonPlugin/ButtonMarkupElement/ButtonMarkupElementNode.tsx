/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HTMLPropsAs, PlateRenderElementProps, Value, useElementProps } from '@udecode/plate';
import { CSSProperties, HTMLAttributeAnchorTarget, ReactElement, ReactNode, useState } from 'react';
import { RichTextButtonStyle, TButtonElement } from '../types';
import { BlockButtonStyles } from '../utils';

export type ButtonRootProps = PlateRenderElementProps<Value, TButtonElement> & HTMLPropsAs<'a'>;

const useButton = (props: ButtonRootProps): HTMLPropsAs<'a'> & { buttonStyle: RichTextButtonStyle } => {
    const _props = useElementProps<TButtonElement, 'a'>({
        ...props,
        elementToAttributes: (element) => ({
            url: element.href,
            buttonStyle: element.buttonStyle || 'primary',
            target: element.target || '_blank',
        }),
    });

    return {
        ...(_props as HTMLPropsAs<'a'> & { buttonStyle: RichTextButtonStyle }),
        // quick fix: hovering <a> with href loses the editor focus
        onMouseOver: (e) => {
            e.stopPropagation();
        },
    };
};

export const ButtonMarkupElementNode = (props: ButtonRootProps) => {
    const { href, target, buttonStyle } = useButton(props);
    const { attributes, children } = props;

    return (
        <HoverableButtonLink
            attributes={attributes}
            href={href}
            target={target}
            styles={BlockButtonStyles[`button${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)}`]}
        >
            {children}
        </HoverableButtonLink>
    );
};

type Props = {
    attributes: ButtonRootProps['attributes'];
    children: ReactNode;
    styles?: CSSProperties & { hover?: CSSProperties };
    href?: string;
    target?: HTMLAttributeAnchorTarget;
};

const HoverableButtonLink = ({
    attributes,
    styles = { hover: {} },
    children,
    href = '#',
    target,
}: Props): ReactElement => {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            {...attributes}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            href={href}
            target={target}
            style={hovered ? { ...styles, ...styles.hover } : styles}
        >
            {children}
        </a>
    );
};
