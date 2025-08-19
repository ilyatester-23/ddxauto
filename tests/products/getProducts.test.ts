import { expect, request, test } from "@playwright/test";
import api from '../../api.json';
import { getBaseParameters } from "../../entities/baseParameters";

test.describe("API-тесты на получение списка продуктов", async () => {
    test("[positive] получить список продуктов", async ({ request }) => {
        const response = await request.get(
            `${api.urls.base_url_api}${api.paths.products}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {...await getBaseParameters()}
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] получить список продуктов только по заморозке", async ({ request }) => {
        const response = await request.get(
            `${api.urls.base_url_api}${api.paths.products}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {...await getBaseParameters(), ...{ category: "freeze" }}
            }
        );

        expect(response.status()).toEqual(200);
    });
});