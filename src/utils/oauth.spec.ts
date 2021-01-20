import nock from "nock";
import {
    getLoginUrl,
    getOauthCredentialDetails,
    getRandomCodeChallenge,
    getUser,
    OauthAccessTokenApiResponse,
    OauthRandomCodeChallenge,
} from "./oauth";

const testBaseUrl = "https://test.frontify.com";

const randomCodeChallenge: OauthRandomCodeChallenge = {
    secret: "random-secret",
    sha256: "random-sha256",
};

const authorizationCode = "abc123";

const accessTokenApiRequest = {
    grant_type: "authorization_code",
    client_id: "block-cli",
    redirect_uri: "http://localhost:5600/oauth",
    scope: "basic:read%2Bblocks:read%2Bblocks:write",
    code_verifier: randomCodeChallenge.secret,
    code: authorizationCode,
};

const accessTokenApiResponse: OauthAccessTokenApiResponse = {
    access_token: "test-access-token",
    expires_in: 1000,
    refresh_token: "test-refresh-token",
    token_type: "test-token-type",
};

describe("OAuth utils", () => {
    beforeAll(() => {
        const testMockApi = nock(testBaseUrl);
        testMockApi.get("/api/oauth/random").reply(200, { data: randomCodeChallenge });
        testMockApi.post("/api/oauth/accesstoken", accessTokenApiRequest).reply(200, accessTokenApiResponse);
        testMockApi.post("/api/oauth/accesstoken").reply(400, { error: true });
    });

    describe(getRandomCodeChallenge, () => {
        it("should get a code challenge object", async () => {
            const data = await getRandomCodeChallenge();
            expect(data).toStrictEqual(randomCodeChallenge);
        });
    });

    describe(getLoginUrl, () => {
        it("should get a correct authorize url with specific oauth query params", () => {
            const expectedResult = `${testBaseUrl}/api/oauth/authorize?response_type=code&client_id=block-cli&redirect_uri=http://localhost:5600/oauth&scope=basic:read%2Bblocks:read%2Bblocks:write&code_challenge=${randomCodeChallenge.sha256}&code_challenge_method=S256`;

            const { sha256 } = randomCodeChallenge;
            expect(getLoginUrl(sha256)).toStrictEqual(expectedResult);
        });
    });

    describe(getOauthCredentialDetails, () => {
        it("should get a tokens object", async () => {
            const { secret } = randomCodeChallenge;
            const data = await getOauthCredentialDetails(secret, authorizationCode);
            expect(data).toStrictEqual(accessTokenApiResponse);
        });

        it("should not get a tokens object with bad code and/or secret", async () => {
            await expect(getOauthCredentialDetails("b4d-secr3t", "b4d-c0d3")).rejects.toThrowError();
        });
    });

    describe(getUser, () => {
        it("should get user object if tokens are stored", () => {
            //
        });

        it("should get undefined if tokens are not stored", () => {
            //
        });
    });
});
