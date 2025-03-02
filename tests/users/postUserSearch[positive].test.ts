import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import api from '../../api.json';
import { Statuses } from "@libs/statuses";
import UsersSearch from "@requests/usersSearch.request";

test.describe("API-тесты на создание подписки клиенту", async () => {
    test("[positive] Получение клуба и создание клиента", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userPhone, userName, userBirthday, userEmail, userLastName, userId } = await test.step("Создать клиента и получить его данные", async () => {
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
                    home_club_id: clubId,
                    club_access: true,
                    admin_panel_access: false,
                    class_registration_access: true,
                    sport_experience: "1-2 года"
                }
            };

            const response = (await (await new createUsersRequests(request).postCreateUsers(Statuses.OK, requestBody)).json()).data;
            return {
                userId: response.id,
                userPhone: response.phone,
                userName: response.name,
                userLastName: response.last_name,
                userEmail: response.email,
                userBirthday: response.birthday
            };
        });

        await test.step("Найти клиента по номеру телефона", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    phone: userPhone
                }
            };

            const response = await new UsersSearch(request).postUsersSearch(Statuses.OK, requestBody);

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.OK)
            });

            await test.step("Проверить что в ответе юзер не удален ", async () => {
                expect((await response.json()).data[0]?.is_deleted).toEqual(false)
            });
        });

        await test.step("Найти клиента по имени фамилии и дате рождения", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    name: userName,
                    last_name: userLastName,
                    birthday: userBirthday
                }
            };

            const response = await new UsersSearch(request).postUsersSearch(Statuses.OK, requestBody);

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.OK)
            });

            await test.step("Проверить что в ответе юзер не удален ", async () => {
                expect((await response.json()).data[0]?.is_deleted).toEqual(false)
            });
        });

        await test.step("Найти клиента по имени фамилии и email", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    name: userName,
                    last_name: userLastName,
                    email: userEmail
                }
            };

            const response = await new UsersSearch(request).postUsersSearch(Statuses.OK, requestBody);

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.OK)
            });

            await test.step("Проверить что в ответе юзер не удален ", async () => {
                expect((await response.json()).data[0]?.is_deleted).toEqual(false)
            });
        });
    });
});