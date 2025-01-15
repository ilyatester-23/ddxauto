import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import { Statuses } from "@libs/statuses";
import { Providers } from "@libs/PaymentProviders";
import PaymentCreate from "@requests/paymentCreate.request";

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

        const subscriptionResponse = await test.step("Создать подписку пользователю", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                start_date: "2025-01-16",
                payment_plan_id: 246,
                club_id: clubId,
                verification_token: "04e595aa-64e7-4203-afe6-804e864d7db2",
            };

            const response = await new createUsersRequests(request).postCreatePaymentPlan(Statuses.OK, userId, requestBody);

            expect(response.status()).toEqual(Statuses.OK);
            const responseData = await response.json();

            return responseData
        });

        const response = await test.step("[positive] Оплата подписки", async () => {
            const requestBodyPayment = {
                session_id: "123",
                request_id: "123",
                request_source: "mobile_app",
                type: "payment",
                gate_id: 1,
                provider_id: Providers.subscription_registration,
                user_id: userId,
                user_payment_plan_id: subscriptionResponse.data?.[0]?.id,
                currency: "RUB",
                fiscal_method: "OrangeData",
                widget_settings: {
                    success_page: "https://site-dev.ddxfitness.ru/checkout/redirect.php",
                    fault_page: "https://site-test.ddxfitness.ru/checkout/redirect.php?error=faild"
                }
            };

            const response = await new PaymentCreate(request).postPaymentCreate(Statuses.OK, requestBodyPayment);

            expect(response.status()).toEqual(Statuses.OK);
        });

        await test.step("[negative] Оплата подписки без обязательных параметров", async () => {
            const requestBodyPaymentInvalid = {
                session_id: "123",
                request_id: "123",
                request_source: "mobile_app",
                type: "payment",
                gate_id: 1,
                provider_id: Providers.subscription_registration,
                user_id: userId,
                user_payment_plan_id: null, // вот тут добавил ошибку, поставил null в обязательном параметре
                currency: "RUB",
                fiscal_method: "OrangeData",
                widget_settings: {
                    success_page: "https://site-dev.ddxfitness.ru/checkout/redirect.php",
                    fault_page: "https://site-test.ddxfitness.ru/checkout/redirect.php?error=faild"
                }
            };

            const response = await new PaymentCreate(request).postPaymentCreate(Statuses.BAD_REQUEST, requestBodyPaymentInvalid);

            expect(response.status()).toEqual(Statuses.BAD_REQUEST);
        });
    });
});