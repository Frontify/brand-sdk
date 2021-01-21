import nock from "nock";
import { Configuration } from "./configuration";
import { getUser } from "./user";

const testBaseUrl = "test.frontify.com";

const dummyTokens = {
    tokens: {
        token_type: "Bearer",
        expires_in: 2592000,
        access_token: "some_access_token",
        refresh_token: "some_refresh_token",
    },
};

const getUserApiResponse = {
    data: {
        current_user: dummyTokens,
    },
};

describe("User utils", () => {
    beforeAll(() => {
        const testMockApi = nock(`https://${testBaseUrl}`);
        testMockApi
            .post("/graphql", { query: "{ current_user { email avatar name } }" })
            .reply(200, getUserApiResponse);
    });

    describe(getUser, () => {
        it("should get user object", async () => {
            //TODO: We shall have a different object for test and prod/dev as it would override existing tokens from the user if testing locally
            const oldTokens = Configuration.get("tokens") || {};
            Configuration.set("tokens", dummyTokens.tokens);
            expect(await getUser(testBaseUrl)).toEqual(dummyTokens);
            Configuration.set("tokens", oldTokens);
        });
    });
});
