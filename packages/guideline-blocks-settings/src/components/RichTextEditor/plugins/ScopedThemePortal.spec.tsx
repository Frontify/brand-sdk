/* (c) Copyright Frontify Ltd., all rights reserved. */

import { render, screen } from '@testing-library/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ScopedThemePortal } from './ScopedThemePortal';

const PRIMARY_BACKGROUND = '--f-theme-settings-button-primary-background-color';
const SECONDARY_COLOR = '--f-theme-settings-button-secondary-color';
const RED = 'rgb(255, 0, 0)';
const BLUE = 'rgb(0, 0, 255)';

const Section = ({ variables, children }: { variables: Record<string, string>; children: ReactNode }) => (
    <div style={variables}>{children}</div>
);

const portaledStyle = () => screen.getByTestId('portaled').style;

describe('ScopedThemePortal', () => {
    it('copies the theme variables of the surrounding scope onto the portaled element', () => {
        render(
            <Section variables={{ [PRIMARY_BACKGROUND]: RED }}>
                <ScopedThemePortal data-test-id="portaled" />
            </Section>,
        );

        expect(portaledStyle().getPropertyValue(PRIMARY_BACKGROUND)).toBe(RED);
    });

    it('leaves out theme variables that no surrounding scope declares', () => {
        render(
            <Section variables={{ [PRIMARY_BACKGROUND]: RED }}>
                <ScopedThemePortal data-test-id="portaled" />
            </Section>,
        );

        expect(portaledStyle().getPropertyValue(SECONDARY_COLOR)).toBe('');
    });

    it('lets the nearest scope win', () => {
        render(
            <Section variables={{ [PRIMARY_BACKGROUND]: RED }}>
                <Section variables={{ [PRIMARY_BACKGROUND]: BLUE }}>
                    <ScopedThemePortal data-test-id="portaled" />
                </Section>
            </Section>,
        );

        expect(portaledStyle().getPropertyValue(PRIMARY_BACKGROUND)).toBe(BLUE);
    });

    it('reads the scope again when it is mounted anew', () => {
        const { rerender } = render(
            <Section variables={{ [PRIMARY_BACKGROUND]: RED }}>
                <ScopedThemePortal data-test-id="portaled" />
            </Section>,
        );
        rerender(<Section variables={{ [PRIMARY_BACKGROUND]: BLUE }}>{null}</Section>);
        rerender(
            <Section variables={{ [PRIMARY_BACKGROUND]: BLUE }}>
                <ScopedThemePortal data-test-id="portaled" />
            </Section>,
        );

        expect(portaledStyle().getPropertyValue(PRIMARY_BACKGROUND)).toBe(BLUE);
    });

    it('keeps the caller`s own styles and props', () => {
        render(
            <Section variables={{ [PRIMARY_BACKGROUND]: RED }}>
                <ScopedThemePortal data-test-id="portaled" data-is-underlay style={{ color: RED }} />
            </Section>,
        );

        expect(portaledStyle().color).toBe(RED);
        expect(screen.getByTestId('portaled')).toHaveAttribute('data-is-underlay');
    });

    it('attaches the portaled element before the effects of the component that renders it run', () => {
        const onMount = vi.fn();
        const Opener = () => {
            const ref = useRef<HTMLDivElement>(null);
            useEffect(() => {
                onMount(ref.current);
            }, []);
            return <ScopedThemePortal ref={ref} data-test-id="portaled" />;
        };

        render(
            <Section variables={{ [PRIMARY_BACKGROUND]: RED }}>
                <Opener />
            </Section>,
        );

        expect(onMount).toHaveBeenCalledWith(screen.getByTestId('portaled'));
    });
});
