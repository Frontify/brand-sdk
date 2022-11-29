import type { FC, CSSProperties } from 'react';
import { type AppBridgeBlock, type Color, useBlockSettings } from '@frontify/app-bridge';
import style from './style.module.css';

type Settings = {
    color: Color;
};

type Props = {
    appBridge: AppBridgeBlock;
};

const toCssRgbaString = (color: Color): string => {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
};

export const AnExampleBlock: FC<Props> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const cssFormattedColor = toCssRgbaString(blockSettings.color);

    return (
        <span className={style.text} style={{ '--text-color': cssFormattedColor } as CSSProperties}>
            A custom block with background color: {cssFormattedColor}
        </span>
    );
};
