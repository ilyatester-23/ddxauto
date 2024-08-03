import { expect, request, test } from "@playwright/test";
import api from '../api.json';

test.describe("API-тесты на получение списка подписок", async () => {
    test("[positive] получить список активных подписок", async ({ request }) => {
        const response = await request.get(
            `${api.urls.base_url_api}${api.paths.paymentPlans}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {
                    session_id: "1",
                    request_id: "2",
                    "request_source": "crm",
                    is_active: true
                }
            }
        );

        expect(response.status()).toEqual(200);
    });
});