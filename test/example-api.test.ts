import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { beforeAll, describe, expect, test } from "vitest";
import { OpenApiAxios } from "../src/index.js";
import { type components, type paths } from "./fixtures/example.api.js";

let mockAdapter: MockAdapter;
let api: OpenApiAxios<paths, "axios">;

const petMock: components["schemas"]["Pet"] = {
  id: 1,
  name: "pet",
  photoUrls: ["http://test.ru"],
};

beforeAll(() => {
  const axiosInstance = axios.create({});
  api = new OpenApiAxios<paths, "axios">(axiosInstance, {
    validStatus: "axios",
  });

  // @ts-expect-error @TODO See issue #4 - https://github.com/web-bee-ru/openapi-axios/issues/4
  mockAdapter = new MockAdapter(axiosInstance);

  mockAdapter.onPost("/pet").reply(200);
  mockAdapter.onPut("/pet").reply(200);
});

describe("Body serializer", () => {
  test("Check required body", async () => {
    const { status } = await api.put("/pet", petMock);
    expect(status).toBe(200);
  });

  test("Check no required body", async () => {
    const { status } = await api.post("/pet", petMock);
    const { status: status2 } = await api.post("/pet", undefined);

    expect(status).toBe(200);
    expect(status2).toBe(200);
  });
});
