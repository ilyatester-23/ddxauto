import { expect, request, test } from "@playwright/test";
import { getRandomEmail, getRandomPhoneNumber } from "../../utils/random";
import createUsersRequests from "../../requests/users.request";
import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { SportExperience } from "@libs/sportExperience";
import { BaseRequestJson } from "@entities/base.requestJson";
import { getUserRequestJson, UserDataRequestJson } from "@entities/user.requestJson";

let requestData: BaseRequestJson<UserDataRequestJson>;

test.beforeEach(async () => {
    requestData = await getUserRequestJson(1, getRandomEmail(), getRandomPhoneNumber())
});

test.describe("Тесты на создание клиент", async () => {
        test(`[positive] Создать клиента с паролем и опытом`, async ({ request }) => {
            await new createUsersRequests(request).postCreateUsers(200, requestData)
    });
});

