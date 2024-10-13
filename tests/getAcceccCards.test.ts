import { expect, test } from "@playwright/test";
import { getRandomPhoneNumber } from "../utils/random";
import AccessCardRequests from "../requests/accessCards.request";
import { getBaseParameters } from "../entities/baseParameters";

const requestBody = {
    session_id: "23",
    request_id: "23",
    request_source: "crm",
    data: [
     {
        access_card_number: getRandomPhoneNumber(),
        user_id: 1746590,
        type: "disposable_card",
        is_blocked: true,
        is_lost: true,
        is_deleted: true,
        block_previous_card: true,
        payable: "guest",
        blocked_at: "2024-10-25T07:27:23Z"
     }
    ]
}

test.describe("API-тесты на получение информации о карте доступа", async () => {
    test("[positive] Получить информацию о карте доступа", async ({ request }) => {
        const createdCard = await new AccessCardRequests(request).postAccessCards(200, requestBody);
        const response = await new AccessCardRequests(request).getAccessCardById(200, await getBaseParameters(), (await createdCard.json()).data[0].id);
        expect((await response.json()).data[0].user.id).toEqual((await createdCard.json()).data[0].user.id)
    });
});