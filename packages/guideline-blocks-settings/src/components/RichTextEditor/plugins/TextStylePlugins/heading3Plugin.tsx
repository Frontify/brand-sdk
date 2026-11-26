/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    MarkupElement,
    type PlatePlugin,
    Plugin,
    type PluginProps,
    type TextStyleRenderElementProps,
    alignmentClassnames,
    createPluginFactory,
    getColumnBreakClasses,
    merge,
} from '@frontify/fondue/rte';
import { type CSSProperties } from 'react';

import { BlockStyles, TextStyles } from '../styles';

const ID = 'textstyle-heading3-plugin';

export class Heading3Plugin extends Plugin {
    public styles: CSSProperties = {};
    constructor({ styles = BlockStyles.heading3, ...props }: PluginProps = {}) {
        super(TextStyles.heading3, {
            label: 'Heading 3',
            markupElement: new Heading3MarkupElement(),
            ...props,
        });
        this.styles = styles;
    }

    plugins(): PlatePlugin[] {
        return [createHeading3Plugin(this.styles)];
    }
}

class Heading3MarkupElement extends MarkupElement {
    constructor(id = ID, node = Heading3MarkupElementNode) {
        super(id, node);
    }
}
const Heading3MarkupElementNode = ({ element, attributes, children, styles }: TextStyleRenderElementProps) => {
    const align = element.align as string;
    return (
        <h3
            {...attributes}
            className={merge([align && alignmentClassnames[align], getColumnBreakClasses(element)])}
            style={styles}
        >
            {children}
        </h3>
    );
};

const createHeading3Plugin = (styles: CSSProperties) =>
    createPluginFactory({
        key: TextStyles.heading3,
        isElement: true,
        component: Heading3MarkupElementNode,
        deserializeHtml: {
            rules: [{ validNodeName: ['h3', 'H3'] }],
        },
    })({
        component: (props: TextStyleRenderElementProps) => <Heading3MarkupElementNode {...props} styles={styles} />,
    });
