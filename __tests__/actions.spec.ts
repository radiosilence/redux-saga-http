import * as A from "../src/actions";
import {
    SG_HTTP_ERROR,
    SG_HTTP_FINALLY,
    SG_HTTP_REQUEST,
    SG_HTTP_SUCCESS
} from "../src/constants";
import { createSgHttpActionTypes } from "../src/utils";

const URL = "https://example.com";
const ACTION_TYPES = createSgHttpActionTypes("TEST");

describe("sgHttpGet", () => {
    it("should return a get action", () => {
        const action = A.sgHttpGet(URL, ACTION_TYPES);
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "GET"
            }
        });
    });
    it("should return a get action with querystring", () => {
        const action = A.sgHttpGet(URL, ACTION_TYPES, { hi: "ho" });
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                query: { hi: "ho" },
                method: "GET"
            }
        });
    });
});

describe("sgHttpPost", () => {
    it("should return a post action", () => {
        const action = A.sgHttpPost(URL, ACTION_TYPES);
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "POST"
            }
        });
    });

    it("should return a post action with body", () => {
        const action = A.sgHttpPost(URL, ACTION_TYPES, { potato: "tomato" });
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "POST",
                body: { potato: "tomato" }
            }
        });
    });
});

describe("sgHttpPut", () => {
    it("should return a put action", () => {
        const action = A.sgHttpPut(URL, ACTION_TYPES);
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "PUT"
            }
        });
    });

    it("should return a put action with body", () => {
        const action = A.sgHttpPut(URL, ACTION_TYPES, { potato: "tomato" });
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "PUT",
                body: { potato: "tomato" }
            }
        });
    });
});

describe("sgHttpDelete", () => {
    it("should return a delete action", () => {
        const action = A.sgHttpDelete(URL, ACTION_TYPES);
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "DELETE"
            }
        });
    });
});

describe("sgHttpHead", () => {
    it("should return a head action", () => {
        const action = A.sgHttpHead(URL, ACTION_TYPES);
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "HEAD"
            }
        });
    });
});

describe("sgHttpPatch", () => {
    it("should return a patch action", () => {
        const action = A.sgHttpPatch(URL, ACTION_TYPES);
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "PATCH"
            }
        });
    });
    it("should return a patch action with body", () => {
        const action = A.sgHttpPatch(URL, ACTION_TYPES, { hi: "ho" });
        expect(action).toMatchObject({
            type: SG_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: "PATCH",
                body: { hi: "ho" }
            }
        });
    });
});
