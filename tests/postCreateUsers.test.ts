import { expect, request, test } from "@playwright/test";
import { getRandomEmail, getRandomPhoneNumber } from "../utils/random";
import createUsersRequests from "../requests/createUsers.request";

const requestBody = {
    session_id: "23",
    request_id: "23",
    request_source: "crm",
    data: {
        email: getRandomEmail(),
        name: "Aotobot",
        last_name: "Тестович",
        middle_name: "Тестов",
        sex: "male",
        password: "qwerty1234",
        phone: getRandomPhoneNumber(),
        birthday: "1990-02-02",
        lang: "ru",
        user_photo_id: 4,
        home_club_id: 1,
        club_access: true,
        admin_panel_access: false,
        class_registration_access: true,
        sport_experience: "1-2 года"
    }
}

test.describe("Тесты на создание клиент", async () => {
        test(`[positive] Создать клиента с паролем и опытом`, async ({ request }) => {
            await new createUsersRequests(request).postCreateUsers(200, requestBody)
    });
});