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

const ID = 'textstyle-imageCaption-plugin';

export class ImageCaptionPlugin extends Plugin {
    public styles: CSSProperties = {};
    constructor({ styles = BlockStyles.imageCaption, ...props }: PluginProps = {}) {
        super(TextStyles.imageCaption, {
            label: 'Image Caption',
            markupElement: new ImageCaptionMarkupElement(),
            ...props,
        });
        this.styles = styles;
    }

    plugins() {
        return [createImageCaptionPlugin(this.styles)];
    }
}

class ImageCaptionMarkupElement extends MarkupElement {
    constructor(id = ID, node = ImageCaptionMarkupElementNode) {
        super(id, node);
    }
}
const ImageCaptionMarkupElementNode = ({ element, attributes, children, styles }: TextStyleRenderElementProps) => {
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

const createImageCaptionPlugin = (styles: CSSProperties) =>
    createPluginFactory({
        key: TextStyles.imageCaption,
        isElement: true,
        component: ImageCaptionMarkupElementNode,
        deserializeHtml: {
            rules: [{ validClassName: TextStyles.imageCaption }],
        },
    })({
        component: (props: TextStyleRenderElementProps) => <ImageCaptionMarkupElementNode {...props} styles={styles} />,
    });
