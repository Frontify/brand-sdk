/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useGetQuery, usePlatformContext } from '@frontify/app-bridge';
import { useState } from 'react';

export const App = () => {
    const { view } = usePlatformContext();
    // Here we have a curried function
    const getData = useGetQuery();

    // Return an instance of a getter
    const [user, setUser] = useState();
    const [email, setEmail] = useState();

    const showStore = async () => {
        const response = await getData(
            `query CurrentUser {
            currentUser {
                id
                email
                avatar
                name
            }
        }`
        );
        setUser(response.data.currentUser.name);
        setEmail(response.data.currentUser.email);
    };

    return (
        <div>
            <p>Whats the current View: {view}</p>
            <p>{user && user}</p>
            <p>{email && email}</p>
            <button onClick={() => showStore()}>get current User and email</button>
        </div>
    );
};
