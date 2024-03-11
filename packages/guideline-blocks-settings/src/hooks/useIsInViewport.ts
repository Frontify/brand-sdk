/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RefObject, useEffect } from 'react';

export const useIsInViewport = <T extends Element>({
    ref,
    disabled,
    onChange,
}: {
    ref: RefObject<T>;
    disabled: boolean;
    onChange: (isInViewport: boolean) => void;
}) => {
    useEffect(() => {
        if (disabled || !ref.current) {
            return;
        }

        let isInViewport = false;

        const intersectionObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting !== isInViewport) {
                isInViewport = entry.isIntersecting;
                onChange(entry.isIntersecting);
            }
        });

        intersectionObserver.observe(ref.current);

        return () => {
            intersectionObserver.disconnect();
        };
    }, [ref, disabled, onChange]);
};
