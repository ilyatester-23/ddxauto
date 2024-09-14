import { expect, request, test } from "@playwright/test";
import api from '../api.json';
import { getBaseParameters } from "../entities/baseParameters";
import { log } from "../utils/logger";

const clubID = [
    1,
    5,
    17,

]

test.describe("Тесты на получение информации о сотрудниках", async () => {
    clubID.forEach(club_id => {
        test(`[positive] API-тесты на получение списка сотрудников`, async ({ request }) => {
            const url = `${api.urls.base_url_api}${api.paths.positions}`;
            const parameters = {...await getBaseParameters()}

            log("request url", url);
            log("parameters", parameters);

        const response = await request.get(  
            url,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {...await getBaseParameters(), ...{ position_name: "Персональный тренер", club_id}},
            }
        );

        log("request status", response.status());
        log("response body", JSON.stringify(await response.json(), null, '\t'));
        expect(response.status()).toEqual(200);
    });
    });
});