import { expect, test } from "@playwright/test"; 
import { getBaseParameters } from "@entities/baseParameters";
import createUsersRequests from "@requests/users.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import getClubs from "@requests/clubs.request";
import { Statuses } from "@libs/statuses";
import UsersSearch from "@requests/usersSearch.request";
import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { SportExperience } from "@libs/sportExperience";
import { getUserRequestJson } from "@entities/user.requestJson";

let clientData: {
    userPhone: string,
    userName: string,
    userLastName: string,
    userEmail: string,
    userBirthday: string
};

test.describe("API-тесты на поиск клиента", () => {

    test.beforeAll(async ({ request }) => {
        const parameters = { ...await getBaseParameters() };
        const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
        const clubsData = await clubsID.json();
        const clubId = clubsData?.data[0]?.id;

        const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber())

        const response = (await (await new createUsersRequests(request).postCreateUsers(Statuses.OK, requestBody)).json()).data;
        clientData = {
            userPhone: response.phone,
            userName: response.name,
            userLastName: response.last_name,
            userEmail: response.email,
            userBirthday: response.birthday
        };
    });

    test("[negative] Поиск по номеру телефона с пустым request_source", async ({ request }) => {
        const requestBody = {
            session_id: requestTestData.sessionId,
            request_id: requestTestData.requestId,
            request_source: "",
            data: {
                phone: clientData.userPhone
            }
        };

        const response = await new UsersSearch(request).postUsersSearch(Statuses.BAD_REQUEST, requestBody);

        expect(response.status()).toEqual(Statuses.BAD_REQUEST);
        expect((await response.json()).error.code).toEqual('bad_request');
    });

    test("[negative] Поиск по имени, фамилии и дате рождения (данные не совпадают)", async ({ request }) => {
        const requestBody = {
            session_id: requestTestData.sessionId,
            request_id: requestTestData.requestId,
            request_source: RequestSource.CRM,
            data: {
                name: "Иван",
                last_name: clientData.userLastName,
                birthday: clientData.userBirthday
            }
        };

        const response = await new UsersSearch(request).postUsersSearch(Statuses.NOT_FOUND, requestBody);

        expect(response.status()).toEqual(Statuses.NOT_FOUND);
        expect((await response.json()).error.message).toEqual('user not found');
    });

    test("[negative] Поиск по невалидным имени, фамилии и email", async ({ request }) => {
        const requestBody = {
            session_id: requestTestData.sessionId,
            request_id: requestTestData.requestId,
            request_source: RequestSource.CRM,
            data: {
                name: 11111,
                last_name: true,
                email: 234
            }
        };

        const response = await new UsersSearch(request).postUsersSearch(Statuses.BAD_REQUEST, requestBody);

        expect(response.status()).toEqual(Statuses.BAD_REQUEST);
        expect((await response.json()).error.code).toEqual('bind_error');
    });

});
