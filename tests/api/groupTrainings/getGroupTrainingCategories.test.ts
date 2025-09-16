import { expect, request, test } from "@playwright/test";
import api from '../../../api.json';
import { getBaseParameters } from "../../../entities/baseParameters";

test.describe("API-тесты на получение списка категорий групповых тренировок", async () => {
    test("Получить список категорий удаленных групповых тренировок", async ({ request }) => {
        const url = `${api.urls.base_url_api}${api.paths.group_training_categories}`;
        const parameters = {...await getBaseParameters(), is_deleted: true}

        const response = await request.get(  
            url,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: parameters
            }
        );

        expect(response.status()).toEqual(200)
    });

    test("Получить список категорий не удаленных групповых тренировок", async ({ request }) => {
        const url = `${api.urls.base_url_api}${api.paths.group_training_categories}`;
        const parameters = {...await getBaseParameters()}

        const response = await request.get(  
            url,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: parameters
            }
        );

        expect(response.status()).toEqual(200)
    });
});