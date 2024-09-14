import { expect, request, test } from "@playwright/test";
import api from '../api.json';
import { getRandomPhoneNumber } from "../utils/random";
import { log } from "../utils/logger";

test.describe("Тесты на создание карт/браслетов доступа", async () => {
    test("[positive] Создать пользователю карту", async ({ request }) => {
        const response = await request.post(
            `${api.urls.base_url_api}${api.paths.access_cards}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                data: {
                    session_id: "549297f8-e38a-47cd-915e-2a1859102539",
                    request_id: "4b5b7836-dce6-4b5e-9f18-76be91bd7d37",
                    request_source: "string",
                    data: [
                      {
                        id: 0,
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
            }
        );
        
        log("request url", URL);
        log("request status", response.status());
        log("request body", JSON.stringify(await request.json, null, '\t'));
        log("response body", JSON.stringify(await response.json(), null, '\t'));
        expect(response.status()).toEqual(200)
    })
})