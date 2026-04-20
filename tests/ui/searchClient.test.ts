import { getBaseParameters } from "@entities/baseParameters";
import test, { expect, request } from "@playwright/test";
import getClubs from "@requests/clubs.request";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { Statuses } from "@libs/statuses";
import { getUserRequestJson } from "@entities/user.requestJson";
import createUsersRequests from "@requests/users.request";
import authCRMTestData from "@data/authCRM.json";
import api from '../../api.json';

test.describe("Тесты на поиск клиента в CRM", async () => {
    test("Поиск клиента по номеру телефона", async ({ request, page }) => {
        const phoneNumber = await test.step("Создать номер телефона клиента ", () => getRandomPhoneNumber());

        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = { ...await getBaseParameters() };
            const clubsID = await new getClubs(request).getClubsID(Statuses.OK, parameters);
            const clubsData = await clubsID.json();
            return clubsData?.data[0]?.id;
        });

        const { userId } = await test.step("Создать клиента и получить его id", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), phoneNumber)
        
            const response = (await (await new createUsersRequests(request).postCreateUsers(200, requestBody)).json()).data;
            return {
                userId: response.id,
            };
        });

        await test.step("Перейти на страницу входа в CRM", async () => {
            await page.goto(`${api.urls.test_url_crm}`);
        });

        await test.step("Заполнить форму авторизации и нажать войти", async () => {
            await page.getByPlaceholder('Логин').fill(authCRMTestData.login);
            await page.getByPlaceholder('Пароль').fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("ввести номер телефона в поле поиска и перейти на страницу клиента", async () => {
            await page.getByTestId('phone-input').waitFor({ state: 'visible', timeout: 3000 });
            await page.getByTestId('phone-input').fill(phoneNumber);
            await page.getByTestId('search').getByRole('img').click();
            await page.getByRole('button', { name: 'Открыть' }).click();
        });

        await test.step("Проверить, что был выполнен переход на страницу клиента", async () => {
            await page.getByTestId('client-phone').waitFor({ state: 'visible', timeout: 5000 });
            expect(await page.url()).toContain(String(userId));
        });

        await test.step("Проверить, что отображается имя и фамилия клиента", async () => {
            await page.getByTestId('client-full-name').waitFor({ state: 'visible', timeout: 3000 });
        })
    });
});