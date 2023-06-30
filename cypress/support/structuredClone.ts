/* (c) Copyright Frontify Ltd., all rights reserved. */

before(() => {
    // Cypress doesn't yet have structuredClone
    cy.window().then((win) => {
        win.structuredClone = (value: object) => {
            return JSON.parse(JSON.stringify(value));
        };
    });
});
