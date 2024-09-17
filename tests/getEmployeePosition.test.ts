import { expect, test } from "@playwright/test";
import api from '../api.json';
import { getBaseParameters } from "../entities/baseParameters";
import { log } from "../utils/logger";

const clubIDs = [
    1, 
    5, 
    17
];

test.describe("API-тесты на получение информации о сотрудниках", async () => {
    clubIDs.forEach(club_id => {
        test.only(`[positive] Получить список сотрудников по позиции и клубам ${club_id}`, async ({ request }) => {
           const url = `${api.urls.base_url_api}${api.paths.positions}`;
           const parameters = { ...await getBaseParameters(), position_name: "Персональный тренер", club_id };

           log("Request URL", url);
           log("Request Parameters", parameters);

           const response = await request.get(
           url, 
            {
                headers: {
                    'Authorization': `${api.tokens.test}`,
                },
                params: parameters,
            }
        );

      log("Request Status", response.status());
      log("Response Body", JSON.stringify(await response.json(), null, '\t'));
      expect(response.status()).toBe(200);
    });
  });
});
