/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactNode } from "react";
import { mount } from "cypress/react";

import { MountOptions, MountReturn } from "cypress/react";

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Mounts a React node
             * @param component React Node to mount
             * @param options Additional options to pass into mount
             */
            mount(
                component: ReactNode,
                options?: MountOptions,
            ): Cypress.Chainable<MountReturn>;
        }
    }
}

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

Cypress.Commands.add("mount", (component: ReactNode, options = {}) => {
    return mount(component, options);
});

import "cypress-real-events/support";
import "./structuredClone";
import "../../packages/guideline-blocks-settings/src/styles.css";
