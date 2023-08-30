/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createPluginFactory } from '@udecode/plate';
import type { CSSProperties } from 'react';
import {
    MarkupElement,
    Plugin,
    PluginProps,
    TextStyleRenderElementProps,
    alignmentClassnames,
    getColumnBreakClasses,
    merge,
} from '@frontify/fondue';
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

    plugins() {
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
