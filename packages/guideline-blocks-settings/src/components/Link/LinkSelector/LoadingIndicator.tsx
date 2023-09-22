/* (c) Copyright Frontify Ltd., all rights reserved. */

import { LoadingCircle, LoadingCircleSize } from '@frontify/fondue';

export const LoadingIndicator = () => {
    return (
        <div className="tw-flex tw-justify-center tw-h-10 tw-items-center">
            <LoadingCircle size={LoadingCircleSize.Small} />
        </div>
    );
};
