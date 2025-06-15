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

test.describe("API-тесты на создание подписки клиенту", async () => {
    test("[positive] Получение клуба и создание клиента", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userId } = await test.step("Создать клиента и получить его id", async () => {
            const requestBody = {
                session_id: requestTestData.sessionId,
                request_id: requestTestData.requestId,
                request_source: RequestSource.CRM,
                data: {
                    email: getRandomEmail(),
                    name: userTestData.firstName,
                    last_name: userTestData.lastName,
                    middle_name: userTestData.middleName,
                    sex: userTestData.sex.male,
                    password: userTestData.password,
                    phone: getRandomPhoneNumber(),
                    birthday: userTestData.birthday,
                    lang: userTestData.lang,
                    user_photo_id: userTestData.userPhotoId,
                    home_club_id: clubId,
                    club_access: true,
                    admin_panel_access: false,
                    class_registration_access: true,
                    sport_experience: SportExperience.ONE_TWO_YEAR
                }
            };

            const response = (await (await new createUsersRequests(request).postCreateUsers(200, requestBody)).json()).data;
            return {
                userId: response.id,
            };
        });

        const subscriptionResponse = await test.step("Создать подписку пользователю", async () => {
            const today = new Date().toISOString().split('T')[0];
            
            const requestBody = {
                session_id: requestTestData.sessionId,
                request_id: requestTestData.requestId,
                request_source: RequestSource.MOBILE,
                start_date: today,
                payment_plan_id: 241,
                club_id: clubId,
                verification_token: "29024e98-27a4-4b52-a2c4-ca6ce7e1711e",
            };

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