import nock from "nock";
import { HttpClient } from "./httpClient";

const testBaseUrl = "test.frontify.com";

const bodyObject = { some: "body", told: "me" };

describe("HttpClient utils", () => {
    beforeAll(() => {
        const testMockApi = nock(`https://${testBaseUrl}`);
        testMockApi.get("/api/get-test").reply(200);
        testMockApi.post("/api/post-test-without-body").reply(200, bodyObject);
        testMockApi.post("/api/post-test-with-body", bodyObject).reply(200, bodyObject);
        testMockApi.put("/api/put-test-without-body").reply(200, bodyObject);
        testMockApi.put("/api/put-test-with-body", bodyObject).reply(200, bodyObject);
        testMockApi.delete("/api/delete-test").reply(200);

        testMockApi.get("/api/error-400").reply(400);
        testMockApi.get("/api/error-500").reply(500);
    });

    const httpClient = new HttpClient(testBaseUrl);

    describe(HttpClient, () => {
        it("should make GET call and resolve the response", async () => {
            expect(await httpClient.get("/api/get-test")).toEqual(undefined);
        });

        it("should make POST call with a body and resolve the response", async () => {
            expect(await httpClient.post("/api/post-test-with-body", bodyObject)).toEqual(bodyObject);
        });

        it("should make POST call without body and resolve the response", async () => {
            expect(await httpClient.post("/api/post-test-without-body")).toEqual(bodyObject);
        });

        it("should make PUT call with a body and resolve the response", async () => {
            expect(await httpClient.put("/api/put-test-with-body", bodyObject)).toEqual(bodyObject);
        });

        it("should make PUT call without body and resolve the response", async () => {
            expect(await httpClient.put("/api/put-test-without-body")).toEqual(bodyObject);
        });

        it("should make DELETE call and resolve the response", async () => {
            expect(await httpClient.delete("/api/delete-test")).toEqual(undefined);
        });

        it("should throw error when host doesn't exist", async () => {
            await expect(httpClient.get("/api/doesnt-exist-url")).rejects.toThrowError();
        });

        it("should throw error when 4XX", async () => {
            await expect(httpClient.get("/api/error-400")).rejects.toThrowError();
        });

        it("should throw error when 5XX", async () => {
            await expect(httpClient.get("/api/error-500")).rejects.toThrowError();
        });
    });
});
