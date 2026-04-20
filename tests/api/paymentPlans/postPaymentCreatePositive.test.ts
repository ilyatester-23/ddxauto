import { APIRequestContext, expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import { Statuses } from "@libs/statuses";
import { Providers } from "@libs/PaymentProviders";
import PaymentCreate from "@requests/paymentCreate.request";
import { getUserRequestJson } from "@entities/user.requestJson";
import { validateJson } from "@utils/validator.util";
import { baseResponseJsonSchema } from "@entities/base.response";
import { createUserDataResponseJsonSchema } from "@entities/user.response";

test.describe("API-тесты на создание подписки клиенту", async () => {

    let clubId: number;
    let userId: number;
    let subscriptionResponse: { data?: { id?: number }[] };

    const paymentCreateResponse = async (request: APIRequestContext, status: Statuses, provider_id: Providers | null) => {
        const requestBodyPayment = {
            session_id: "123",
            request_id: "123",
            request_source: "mobile_app",
            type: "payment",
            gate_id: 1,
            provider_id: provider_id,
            user_id: userId,
            user_payment_plan_id: subscriptionResponse.data?.[0]?.id,
            currency: "RUB",
            fiscal_method: "OrangeData",
            widget_settings: {
                success_page: "https://site-dev.ddxfitness.ru/checkout/redirect.php",
                fault_page: "https://site-test.ddxfitness.ru/checkout/redirect.php?error=faild"
            }
        };

        const paymentCreateResponse = await new PaymentCreate(request).postPaymentCreate(status, requestBodyPayment);

        return paymentCreateResponse;
    }


    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });
    });

    test.beforeEach(async ({ request }) => {
        const createUserResponse = await test.step("Создать клиента и получить его id", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber())

            const response = await new createUsersRequests(request).postCreateUsers(Statuses.OK, requestBody);
            const responseData = await response.json();
            
            userId = responseData.data.id;
            
            return responseData;
        });

        await test.step("Проверить схему ответа создания клиента", async () => {
            await expect(validateJson(baseResponseJsonSchema, createUserResponse)).resolves.toBeTruthy();
            await expect(validateJson(createUserDataResponseJsonSchema, createUserResponse.data)).resolves.toBeTruthy();
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

    test("[positive] Создание подписки клиенту 6 провайдером", async ({ request }) => {
        const response = await test.step("Создание оплаты подписки 6 провайдером", 
            async () => paymentCreateResponse(request, Statuses.OK, Providers.subscription_registration));

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.OK)
            });

            await test.step("Проверить статус транзакции в ответе", async () => {
                expect((await response.json()).transaction.status).toEqual('in progress')
            });
        })

    test("[positive] Создание подписки клиенту 2 провайдером", async ({ request }) => {
            const response = await test.step("Создание оплаты подписки 2 провайдером", 
                async () => paymentCreateResponse(request, Statuses.OK, Providers.subscription_payment));
    
                await test.step("Проверить статус ответа", async () => {
                    expect(response.status()).toEqual(Statuses.OK)
                });
    
                await test.step("Проверить статус транзакции в ответе", async () => {
                    expect((await response.json()).transaction.status).toEqual('in progress')
                });
            })
});