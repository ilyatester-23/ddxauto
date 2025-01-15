import { expect, test } from "@playwright/test";
import { getBaseParameters } from "../../entities/baseParameters";
import createUsersRequests from "../../requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "../../utils/random";
import getClubs from "../../requests/clubs.request";
import VerifyRequest from "../../requests/verify.request";

test.describe("API-тесты на получение отправки кода верификации клиенту", async () => {
    test("[positive] Отправка кода верификации клиенту", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(200, await parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userId, userPhone } = await test.step("Получить id клиента", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    email: getRandomEmail(),
                    name: "Aotobot",
                    last_name: "Тестович",
                    middle_name: "Тестов",
                    sex: "male",
                    password: "qwerty1234",
                    phone: getRandomPhoneNumber(),
                    birthday: "1990-02-02",
                    lang: "ru",
                    user_photo_id: 4,
                    home_club_id: clubId,
                    club_access: true,
                    admin_panel_access: false,
                    class_registration_access: true,
                    sport_experience: "1-2 года"
                }
            };

            const response = (await (await new createUsersRequests(request).postCreateUsers(200, requestBody)).json()).data;
            return {
                userId: response.id,
                userPhone: response.phone
            };
        });

        const response = await test.step("Отправить код верификации клиенту", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    message_type: "sms",
                    contact: userPhone,
                    template: "mail_signing_an_agreement",
                    user_id: userId
                }
            };

            const response = await new VerifyRequest(request).postGetCode(200, requestBody);

            return response.json();
        });

        await test.step("Проверки", async () => {
            expect(response.status).toEqual('OK');
        })

    });
});
