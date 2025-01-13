import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/createUsers.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import api from '../../api.json';
import { Statuses } from "@libs/statuses";
import { Providers } from "@libs/PaymentProviders";

test.describe("API-тесты на создание подписки клиенту", async () => {
    test("Получение клуба и создание клиента", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userId } = await test.step("Создать клиента и получить его id", async () => {
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

            const response = (await (await new createUsersRequests(request).postCreateUsers(Statuses.OK, requestBody)).json()).data;
            return {
                userId: response.id,
            };
        });

        const { userPaymentPlanId } = await test.step("Создать подписку пользователю", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                start_date: "2025-01-14",
                payment_plan_id: 246,
                club_id: clubId,
                verification_token: "f5046b45-7c68-408e-afc4-d0125374959e",
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

            console.log("Subscription Response:", responseData);

            // Извлекаем user_payment_plan_id из массива data
            const userPaymentPlanId = responseData?.data?.[0]?.id;

            if (!userPaymentPlanId) {
                throw new Error("userPaymentPlanId is missing in the subscription response.");
            }

            return {
                userPaymentPlanId,
            };
        });

        await test.step("Создать оплату подписки", async () => {
            const requestBodyPayment = {
                session_id: "123",
                request_id: "123",
                request_source: "mobile_app",
                type: "payment",
                gate_id: 1,
                provider_id: 6,
                user_id: userId,
                user_payment_plan_id: userPaymentPlanId,
                currency: "RUB",
                fiscal_method: "OrangeData",
                widget_settings: {
                    success_page: "https://site-dev.ddxfitness.ru/checkout/redirect.php",
                    fault_page: "https://site-test.ddxfitness.ru/checkout/redirect.php?error=faild"
                }
            };

            const urlPayment = "https://api.test.ddxfitness.ru/payment/create";
            const responsePayment = await request.post(urlPayment, {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                data: requestBodyPayment
            });

            console.log("Payment Response status:", responsePayment.status());
            console.log("Payment Response body:", await responsePayment.text());

            expect(responsePayment.status()).toEqual(200);
            const paymentData = await responsePayment.json();

            expect(paymentData).toHaveProperty("success", true);
        });
    });
});

