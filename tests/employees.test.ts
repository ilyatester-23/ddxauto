import { expect, request, test } from "@playwright/test";
import api from '../api.json';
import { getBaseParameters } from "../entities/baseParameters";

test.describe("Тесты на получение информации о сотрудниках", async () => {
    test("[positive] получить информацию о сотруднике(Выбрал именно одного сотрудника, так как на всех сотрудников - запрос падает в Postman)", async ({ request }) => {
        const response = await request.get(
            `${api.urls.base_url_api}${api.paths.positions}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {...await getBaseParameters(), ...{ employee_id: 5993 }}
            }
        );

        expect(response.status()).toEqual(200);
    });
});