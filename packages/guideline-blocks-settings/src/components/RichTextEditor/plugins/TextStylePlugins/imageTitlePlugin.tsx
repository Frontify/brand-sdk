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

const ID = 'textstyle-imageTitle-plugin';

export class ImageTitlePlugin extends Plugin {
    public styles: CSSProperties = {};
    constructor({ styles = BlockStyles.imageTitle, ...props }: PluginProps = {}) {
        super(TextStyles.imageTitle, {
            label: 'Image Title',
            markupElement: new ImageTitleMarkupElement(),
            ...props,
        });
        this.styles = styles;
    }

    plugins(): PlatePlugin[] {
        return [createImageTitlePlugin(this.styles)];
    }
}

class ImageTitleMarkupElement extends MarkupElement {
    constructor(id = ID, node = ImageTitleMarkupElementNode) {
        super(id, node);
    }
}
const ImageTitleMarkupElementNode = ({ element, attributes, children, styles }: TextStyleRenderElementProps) => {
    const align = element.align as string;
    return (
        <p
            {...attributes}
            className={merge([align && alignmentClassnames[align], getColumnBreakClasses(element)])}
            style={styles}
        >
            {children}
        </p>
    );
};

const createImageTitlePlugin = (styles: CSSProperties) =>
    createPluginFactory({
        key: TextStyles.imageTitle,
        isElement: true,
        component: ImageTitleMarkupElementNode,
        deserializeHtml: {
            rules: [{ validClassName: TextStyles.imageTitle }],
        },
    })({
        component: (props: TextStyleRenderElementProps) => <ImageTitleMarkupElementNode {...props} styles={styles} />,
    });
