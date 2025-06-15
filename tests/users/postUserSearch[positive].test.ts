import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import { Statuses } from "@libs/statuses";
import UsersSearch from "@requests/usersSearch.request";
import { SportExperience } from "@libs/sportExperience";
import { RequestSource } from "@libs/requestSource";
import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"

let clientData: {
    userPhone: string;
    userName: string;
    userLastName: string;
    userEmail: string;
    userBirthday: string;
};

test.describe("API-тесты на поиск клиента", () => {
    test.beforeAll(async ({ request }) => {
        const parameters = { ...await getBaseParameters() };
        const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
        const clubsData = await clubsID.json();
        const clubId = clubsData?.data[0]?.id;

        const createBody = {
            session_id: requestTestData.sessionId,
            request_id: requestTestData.requestId,
            request_source: RequestSource.CRM,
            data: {
                email: getRandomEmail(),
                name: userTestData.firstName,
                last_name: userTestData.lastName,
                middle_name: userTestData.middleName,
                sex: userTestData.sex.male,
                password: userTestData.password,
                phone: getRandomPhoneNumber(),
                birthday: userTestData.birthday,
                lang: userTestData.lang,
                user_photo_id: userTestData.userPhotoId,
                home_club_id: clubId,
                club_access: true,
                admin_panel_access: false,
                class_registration_access: true,
                sport_experience: SportExperience.TWO_THREE_YEAR
            }
        };

        const createdUser = (await (await new createUsersRequests(request).postCreateUsers(Statuses.OK, createBody)).json()).data;

        clientData = {
            userPhone: createdUser.phone,
            userName: createdUser.name,
            userLastName: createdUser.last_name,
            userEmail: createdUser.email,
            userBirthday: createdUser.birthday
        };
    });

    test("[positive] Поиск по номеру телефона", async ({ request }) => {
        const requestBody = {
            session_id: requestTestData.sessionId,
            request_id: requestTestData.requestId,
            request_source: RequestSource.CRM,
            data: {
                phone: clientData.userPhone
            }
        };

        const response = await new UsersSearch(request).postUsersSearch(Statuses.OK, requestBody);
        expect(response.status()).toEqual(Statuses.OK);
        expect((await response.json()).data[0]?.is_deleted).toEqual(false);
    });

    test("[positive] Поиск по имени, фамилии и дате рождения", async ({ request }) => {
        const requestBody = {
            session_id: requestTestData.sessionId,
            request_id: requestTestData.requestId,
            request_source: RequestSource.CRM,
            data: {
                name: clientData.userName,
                last_name: clientData.userLastName,
                birthday: clientData.userBirthday
            }
        };

        const response = await new UsersSearch(request).postUsersSearch(Statuses.OK, requestBody);
        expect(response.status()).toEqual(Statuses.OK);
        expect((await response.json()).data[0]?.is_deleted).toEqual(false);
    });

    test("[positive] Поиск по имени, фамилии и email", async ({ request }) => {
        const requestBody = {
            session_id: "23",
            request_id: "23",
            request_source: "crm",
            data: {
                name: clientData.userName,
                last_name: clientData.userLastName,
                email: clientData.userEmail
            }
        };

        const response = await new UsersSearch(request).postUsersSearch(Statuses.OK, requestBody);
        expect(response.status()).toEqual(Statuses.OK);
        expect((await response.json()).data[0]?.is_deleted).toEqual(false);
    });
});
