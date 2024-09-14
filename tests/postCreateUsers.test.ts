import { expect, request, test } from "@playwright/test";
import api from '../api.json';
import { getRandomEmail, getRandomPhoneNumber } from "../utils/random";

const sportExperience = [
    "Нет опыта",
    "0-6 месяцев",
    "6-12 месяцев",
    "1-2 года",
    "2-3 года",
    "3-5 лет",
    "Больше 5 лет",
    "Не указан"

]

test.describe("Тесты на создание клиентов", async () => {
    sportExperience.forEach(experience => {
        test(`[positive] Создать клиента, без пароля с опытом ${experience}`, async ({ request }) => {
            const response = await request.post(
                `${api.urls.base_url_api}${api.paths.users}`,
                {
                    headers: {
                        'Authorization': `${api.tokens.test}`
                    },
                    data: {
                        session_id: "549297f8-e38a-47cd-915e-2a1859102539",
                        request_id: "4b5b7836-dce6-4b5e-9f18-76be91bd7d37",
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
                            sport_experience: experience
                        }
                    }
                }
            );
            
            expect(response.status()).toEqual(200);
        });
    });
});