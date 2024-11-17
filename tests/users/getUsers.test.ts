import { expect, test } from "@playwright/test";
import createUsersRequests from "../../requests/createUsers.request";
import { getRandomEmail, getRandomPhoneNumber } from "../../utils/random";
import getClubs from "../../requests/clubs.request";
import { getBaseParameters } from "../../entities/baseParameters";

const createRequestBody = (clubID) => ({
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
        home_club_id: clubID,
        club_access: true,
        admin_panel_access: false,
        class_registration_access: true,
        sport_experience: "1-2 года"
    }
});

test.describe("API-тесты на получение информации о клиенте", async () => {
    test("[positive] Получить информацию о клиенте", async ({ request }) => {
        let clubID; Number;

        await test.step("[positive] Получить информацию о клиенте", async () => {
            const clubsID = await new getClubs(request).getClubsID(200, await getBaseParameters());
            const clubsData = await clubsID.json();
            clubID = clubsData.data[0].id;
            const response = await new getClubs(request).getClubById(200, await getBaseParameters(), clubID);

            expect((await response.json()).data[0].id).toEqual(clubID);
        });

        await test.step("[positive] Создание клиента", async () => {
            const requestBody = createRequestBody(clubID);
            const createdUser = await new createUsersRequests(request).postCreateUsers(200, requestBody);
            const response = await new createUsersRequests(request).getUserById(200, await getBaseParameters(), (await createdUser.json()).data.id);

            expect((await response.json()).data.home_club_id).toEqual(clubID);
            expect((await response.json()).data.id).toEqual((await createdUser.json()).data.id);
        });
    });
});