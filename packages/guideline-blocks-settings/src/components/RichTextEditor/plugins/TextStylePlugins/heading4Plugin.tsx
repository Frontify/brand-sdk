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

const ID = 'textstyle-heading4-plugin';

export class Heading4Plugin extends Plugin {
    public styles: CSSProperties = {};
    constructor({ styles = BlockStyles.heading4, ...props }: PluginProps = {}) {
        super(TextStyles.heading4, {
            label: 'Heading 4',
            markupElement: new Heading4MarkupElement(),
            ...props,
        });
        this.styles = styles;
    }

    plugins() {
        return [createHeading4Plugin(this.styles)];
    }
}

class Heading4MarkupElement extends MarkupElement {
    constructor(id = ID, node = Heading4MarkupElementNode) {
        super(id, node);
    }
}

const Heading4MarkupElementNode = ({ element, attributes, children, styles }: TextStyleRenderElementProps) => {
    const align = element.align as string;
    return (
        <h4
            {...attributes}
            className={merge([align && alignmentClassnames[align], getColumnBreakClasses(element)])}
            style={styles}
        >
            {children}
        </h4>
    );
};

const createHeading4Plugin = (styles: CSSProperties) =>
    createPluginFactory({
        key: TextStyles.heading4,
        isElement: true,
        component: Heading4MarkupElementNode,
        deserializeHtml: {
            rules: [{ validNodeName: ['h4', 'H4'] }],
        },
    })({
        component: (props: TextStyleRenderElementProps) => <Heading4MarkupElementNode {...props} styles={styles} />,
    });
