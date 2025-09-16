import { expect, request, test } from "@playwright/test";
import api from '../../../api.json';
import { getBaseParameters } from "../../../entities/baseParameters";
import { log } from "../../../utils/logger";

test.describe("API-тесты на получение списка скидок", async () => {
    test("[positive] Получить список активных скидок", async ({ request }) => {
        const response = await request.get(
            `${api.urls.base_url_api}${api.paths.discounts}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {...await getBaseParameters(), is_active: true, available_interfaces: "web_app"}
            }
        );

      log("Request Status", response.status());
      log("Response Body", JSON.stringify(await response.json(), null, '\t'));
      expect(response.status()).toBe(200);
    });
});