import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import api from '../../api.json';
import { Statuses } from "@libs/statuses";
import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { SportExperience } from "@libs/sportExperience";
import { getUserRequestJson } from "@entities/user.requestJson";
import { getPaymentPlanRequestJson } from "@entities/paymentPlan.requestJson";

test.describe("API-тесты на создание подписки клиенту", async () => {
    test("[positive] Получение клуба и создание клиента", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userId } = await test.step("Создать клиента и получить его id", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber())

            const response = (await (await new createUsersRequests(request).postCreateUsers(200, requestBody)).json()).data;
            return {
                userId: response.id,
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