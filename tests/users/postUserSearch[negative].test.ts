import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import api from '../../api.json';
import { Statuses } from "@libs/statuses";
import UsersSearch from "@requests/usersSearch.request";

test.describe("API-тесты на поиск клиента", async () => {
    test("[positive] Получение клуба и создание клиента", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userPhone, userName, userBirthday, userEmail, userLastName, } = await test.step("Создать клиента и получить его данные", async () => {
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
                userPhone: response.phone,
                userName: response.name,
                userLastName: response.last_name,
                userEmail: response.email,
                userBirthday: response.birthday
            };
        });

        await test.step("Найти клиента по номеру телефона с пустым request_source", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "",
                data: {
                    phone: userPhone
                }
            };

            const response = await new UsersSearch(request).postUsersSearch(Statuses.BAD_REQUEST, requestBody);

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.BAD_REQUEST)
            });

            await test.step("Проверить что в ответе возвращается ошибка", async () => {
                expect((await response.json()).error.code).toEqual('bad_request')
            });
        });

        await test.step("Найти клиента по имени фамилии и дате рождения, которые не совпадают", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    name: "Иван",
                    last_name: userLastName,
                    birthday: userBirthday
                }
            };

            const response = await new UsersSearch(request).postUsersSearch(Statuses.NOT_FOUND, requestBody);

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.NOT_FOUND)
            });

            await test.step("Проверить что в ответе возвращается ошибка ", async () => {
                expect((await response.json()).error.message).toEqual('user not found')
            });
        });

        await test.step("Найти клиента по не валидным имени фамилии и email", async () => {
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    name: userName.id,
                    last_name: userLastName.id,
                    email: userEmail.id
                }
            };

            const response = await new UsersSearch(request).postUsersSearch(Statuses.BAD_REQUEST, requestBody);

            await test.step("Проверить статус ответа", async () => {
                expect(response.status()).toEqual(Statuses.BAD_REQUEST)
            });

            await test.step("Проверить что в ответе возвращается ошибка ", async () => {
                expect((await response.json()).error.code).toEqual('bad_request')
            });
        });
    });
});