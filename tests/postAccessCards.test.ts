import { expect, request, test } from "@playwright/test";
import { getRandomPhoneNumber } from "../utils/random";
import AccessCardRequests from "../requests/accessCards.request";

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

test.describe("Тесты на создание карт/браслетов доступа", async () => {
    test("[positive] Создать пользователю карту", async ({ request }) => {
        await new AccessCardRequests(request).postAccessCards(200, requestBody)
    });
});