import { expect, test } from "@playwright/test";
import createUsersRequests from "../../../requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "../../../utils/random";
import getClubs from "../../../requests/clubs.request";
import { getBaseParameters } from "../../../entities/baseParameters";
import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { SportExperience } from "@libs/sportExperience";

const createRequestBody = (clubID) => ({
    session_id: requestTestData.sessionId,
    request_id: requestTestData.requestId,
    request_source: RequestSource.CRM,
    data: {
        email: getRandomEmail(),
        name: userTestData.firstName,
        last_name: userTestData.lastName,
        middle_name: userTestData.middleName,
        sex: userTestData.sex.female,
        password: userTestData.password,
        phone: getRandomPhoneNumber(),
        birthday: userTestData.birthday,
        lang: userTestData.lang,
        user_photo_id: userTestData.userPhotoId,
        home_club_id: clubID,
        club_access: true,
        admin_panel_access: false,
        class_registration_access: true,
        sport_experience: SportExperience.MORE_FIVE_YEAR
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