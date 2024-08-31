import { expect, request, test } from "@playwright/test";
import api from '../api.json';
import { getRandomEmail, getRandomPhoneNumber } from "../utils/random";

test.describe("Тесты на создание клиентов", async () => {
    test("[positive] Создать клиента без опыта", async ({ request }) => {
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
                        password: "qwerty123",
                        phone: getRandomPhoneNumber(),
                        birthday: "1990-02-02",
                        lang: "ru",
                        user_photo_id: 4,
                        home_club_id: 1,
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "Нет опыта"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента с опытом 0-6 месяцев", async ({ request }) => {
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
                        password: null,
                        phone: getRandomPhoneNumber(),
                        birthday: "1990-02-02",
                        lang: "ru",
                        user_photo_id: 4,
                        home_club_id: 1,
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "0-6 месяцев"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента без пароля и с опытом 6-12 месяцев", async ({ request }) => {
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
                        password: null,
                        phone: getRandomPhoneNumber(),
                        birthday: "1990-02-02",
                        lang: "ru",
                        user_photo_id: 4,
                        home_club_id: 1,
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "6-12 месяцев"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента с опытом 1-2 года", async ({ request }) => {
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
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "1-2 года"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента с опытом 2-3 года", async ({ request }) => {
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
                        password: null,
                        phone: getRandomPhoneNumber(),
                        birthday: "1990-02-02",
                        lang: "ru",
                        user_photo_id: 4,
                        home_club_id: 1,
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "2-3 года"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента с опытом 3-5 лет", async ({ request }) => {
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
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "3-5 лет"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента с опытом больше 5 лет", async ({ request }) => {
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
                        club_access: false,
                        admin_panel_access: false,
                        class_registration_access: false,
                        sport_experience: "Больше 5 лет"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });

    test("[positive] Создать клиента, у которого опыт не указан", async ({ request }) => {
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
                        sport_experience: "Не указан"
                    }
                }
            }
        );

        expect(response.status()).toEqual(200);
    });
});