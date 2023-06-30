/* (c) Copyright Frontify Ltd., all rights reserved. */

//@ts-ignore
global.process ||= {};
//@ts-ignore
global.process.env ||= {};

before(() => {
    cy.exec("npx tailwindcss -m").then(({ stdout }) => {
        if (!document.head.querySelector("#tailwind-style")) {
            const link = document.createElement("style");
            link.id = "tailwind-style";
            link.innerHTML = stdout;

            document.head.appendChild(link);
        }
    });
});

import "@frontify/fondue/style";
import "cypress-real-events/support";
import "./structuredClone";
