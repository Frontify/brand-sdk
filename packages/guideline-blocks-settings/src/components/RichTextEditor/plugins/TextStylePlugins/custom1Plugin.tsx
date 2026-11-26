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

const ID = 'textstyle-custom1-plugin';

export class Custom1Plugin extends Plugin {
    public styles: CSSProperties = {};
    constructor({ styles = BlockStyles.custom1, ...props }: PluginProps = {}) {
        super(TextStyles.custom1, {
            label: 'Custom 1',
            markupElement: new Custom1MarkupElement(),
            ...props,
        });
        this.styles = styles;
    }

    plugins(): PlatePlugin[] {
        return [createCustom1Plugin(this.styles)];
    }
}

class Custom1MarkupElement extends MarkupElement {
    constructor(id = ID, node = Custom1MarkupElementNode) {
        super(id, node);
    }
}

const Custom1MarkupElementNode = ({ element, attributes, children, styles }: TextStyleRenderElementProps) => {
    const align = element.align as string;
    return (
        <p
            {...attributes}
            style={styles}
            className={merge([align && alignmentClassnames[align], getColumnBreakClasses(element)])}
        >
            {children}
        </p>
    );
};

const createCustom1Plugin = (styles: CSSProperties) =>
    createPluginFactory({
        key: TextStyles.custom1,
        isElement: true,
        deserializeHtml: {
            rules: [{ validClassName: TextStyles.custom1 }],
        },
    })({
        component: (props: TextStyleRenderElementProps) => <Custom1MarkupElementNode {...props} styles={styles} />,
    });
