import { APIRequestContext, expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import { Statuses } from "@libs/statuses";
import { Providers } from "@libs/PaymentProviders";
import PaymentCreate from "@requests/paymentCreate.request";

test.describe("API-тесты на создание подписки клиенту", async () => {

    let clubId: number;
    let userId: number;
    let subscriptionResponse: any;

    const paymentCreateResponse = async (request: APIRequestContext, status: Statuses, provider_id: Providers | null) => {
        const user_payment_plan_id = subscriptionResponse?.data?.[0]?.id;
    
        const requestBodyPayment = {
            session_id: "123",
            request_id: "123",
            request_source: "mobile_app",
            type: "payment",
            gate_id: 1,
            provider_id,
            user_id: userId,
            user_payment_plan_id,
            currency: "RUB",
            fiscal_method: "OrangeData",
            widget_settings: {
                success_page: "https://site-dev.ddxfitness.ru/checkout/redirect.php",
                fault_page: "https://site-test.ddxfitness.ru/checkout/redirect.php?error=faild"
            }
        };
    
        return await new PaymentCreate(request).postPaymentCreate(status, requestBodyPayment);
    };


    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });
    });

    test.beforeEach(async ({ request }) => {
        userId = await test.step("Создать клиента и получить его id", async () => {
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

            const { id } = (await (await new createUsersRequests(request).postCreateUsers(Statuses.OK, requestBody)).json()).data;
            return id;
        });

        subscriptionResponse = await test.step("Создать подписку пользователю", async () => {
            const today = new Date().toISOString().split('T')[0];

            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                start_date: today,
                payment_plan_id: 241,
                club_id: clubId,
                verification_token: "edb64773-55a1-4833-875f-cee554b83e94",
            };

            const response = await new createUsersRequests(request).postCreatePaymentPlan(Statuses.OK, userId, requestBody);

            expect(response.status()).toEqual(Statuses.OK);
            const responseData = await response.json();

            return responseData
        });
    });

    test("[negative] Создание подписки клиенту 6 провайдером", async ({ request }) => {
        const response = await test.step("Создание оплаты подписки 6 провайдером", 
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, null));

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.BAD_REQUEST)
            });

            await test.step("Проверить сообщение  об ошибке", async () => {
                expect((await response.json()).error.message).toEqual("not payment provider")
            });
        });

    test("[negative] Создание подписки клиенту 2 провайдером", async ({ request }) => {
            const response = await test.step("Создание оплаты подписки 2 провайдером", 
                async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, null));
    
                await test.step("Проверить статус ответа", async () => {
                    expect(response.status()).toEqual(Statuses.BAD_REQUEST)
                });
    
                await test.step("Проверить сообщение  об ошибке", async () => {
                    expect((await response.json()).error.message).toEqual("not payment provider")
                });
            });
});