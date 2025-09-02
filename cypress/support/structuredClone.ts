/* (c) Copyright Frontify Ltd., all rights reserved. */

before(() => {
    // Cypress doesn't yet have structuredClone
    cy.window().then((win) => {
        // @ts-expect-error Stub
        win.structuredClone = (value: object) => {
            return JSON.parse(JSON.stringify(value));
        };
    });
});
