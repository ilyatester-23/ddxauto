import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import api from '../../../api.json';
import { Statuses } from "@libs/statuses";
import { getUserRequestJson } from "@entities/user.requestJson";
import { getPaymentPlanRequestJson } from "@entities/paymentPlan.requestJson";
import { validateJson } from "@utils/validator.util";
import { baseResponseJsonSchema } from "@entities/base.response";
import { createUserDataResponseJsonSchema } from "@entities/user.response";

test.describe("API-тесты на создание подписки клиенту", async () => {
    test("[positive] Получение клуба и создание клиента", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userId, userResponseData } = await test.step("Создать клиента и получить его id", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber())

            const response = await new createUsersRequests(request).postCreateUsers(200, requestBody);
            const responseData = await response.json();
            
            await test.step("Проверить схему ответа создания клиента", async () => {
                await expect(validateJson(baseResponseJsonSchema, responseData)).resolves.toBeTruthy();
                await expect(validateJson(createUserDataResponseJsonSchema, responseData.data)).resolves.toBeTruthy();
            });
            
            return {
                userId: responseData.data.id,
                userResponseData: responseData
            };
        });

        const subscriptionResponse = await test.step("Создать подписку пользователю", async () => {
            
            const requestBody = await getPaymentPlanRequestJson(clubId)

            const url = `https://api.test.ddxfitness.ru/users/${userId}/user_payment_plans`;
            const response = await request.post(url, {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                data: requestBody
            });

            expect(response.status()).toEqual(200);
            const responseData = await response.json();

            return responseData;
        });
    });
});