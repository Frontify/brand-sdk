import { printLogo } from "./logo";

describe("Logo utils", () => {
    describe(printLogo, () => {
        it("should print the logo", () => {
            console.log = jest.fn();
            printLogo();
            expect(console.log).toHaveBeenCalled();
        });
    });
});
