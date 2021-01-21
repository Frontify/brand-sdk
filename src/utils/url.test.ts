import { getValidInstanceUrl } from "./url";

describe("URL utils", () => {
    describe(getValidInstanceUrl, () => {
        it("should correctly give hostname of a given domain name", () => {
            const domainNames = [
                "weare.frontify.com",
                "weare.frontify.com/",
                "weare.frontify.com//",
                "weare.frontify.com///////",
                "weare.frontify.com/dashboard",
                "https://weare.frontify.com",
                "http://weare.frontify.com",
            ];

            domainNames.forEach((domainName) => {
                const actual = getValidInstanceUrl(domainName);
                expect(actual).toBe("weare.frontify.com");
            });
        });
    });
});
