import type { CSSProperties, FC } from 'react';
import { type Color, useBlockSettings } from '@frontify/app-bridge';
import type { BlockProps } from '@frontify/guideline-blocks-settings';

import style from './style.module.css';

type Settings = {
    color: Color;
};

const toCssRgbaString = (color: Color): string => {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const cssFormattedColor = toCssRgbaString(blockSettings.color);

    return (
        <span className={style.text} style={{ '--text-color': cssFormattedColor } as CSSProperties}>
            A custom block in {blockSettings.color.name ?? cssFormattedColor} and underlined
        </span>
    );
};
