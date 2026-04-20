import { getBaseParameters } from "@entities/baseParameters";
import getClubs from "@requests/clubs.request";
import { Statuses } from "@libs/statuses";
import { baseResponseJsonSchema } from "@entities/base.response";
import { createUserDataResponseJsonSchema } from "@entities/user.response";
import { validateJson } from "@utils/validator.util";
import { getUserRequestJson } from "@entities/user.requestJson";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import test, { expect } from "@playwright/test";

let clubId: number;

test.describe("API-тесты на создание клиентов", async () => {
    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const parameters = {...await getBaseParameters()};
            const getClubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const getClubsData = await getClubsID.json();
            return getClubsData?.data[0]?.id;
        });
    });
    test("Создать клиента", async( {request}) => {
        const response =await test.step("Создать клиента", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return (await (await new createUsersRequests(request).postCreateUsers(Statuses.OK, requestBody)).json());
        });

        await test.step("Проверить схему ответа", async () => {
            await expect(validateJson(baseResponseJsonSchema, response)).resolves.toBeTruthy();
            await expect(validateJson(createUserDataResponseJsonSchema, response.data)).resolves.toBeTruthy();
        });
    });
});
