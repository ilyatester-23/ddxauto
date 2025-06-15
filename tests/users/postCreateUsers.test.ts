import { expect, request, test } from "@playwright/test";
import { getRandomEmail, getRandomPhoneNumber } from "../../utils/random";
import createUsersRequests from "../../requests/users.request";
import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { SportExperience } from "@libs/sportExperience";

const requestBody = {
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
        home_club_id: 1,
        club_access: true,
        admin_panel_access: false,
        class_registration_access: true,
        sport_experience: SportExperience.NO_EXPERIENCE
    }
}

test.describe("Тесты на создание клиент", async () => {
        test(`[positive] Создать клиента с паролем и опытом`, async ({ request }) => {
            await new createUsersRequests(request).postCreateUsers(200, requestBody)
    });
});