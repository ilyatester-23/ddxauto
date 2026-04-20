import test from "@playwright/test";
import api from '../../api.json';
import authCRMTestData from "@data/authCRM.json";

test.describe("Тесты на авторизацию в CRM", async () => {
    test("Успешная авторизация в CRM", async ({ page }) => {
        await test.step("Перейти на страницу входа в CRM", async () => {
            await page.goto(`${api.urls.test_url_crm}`);
        });

        await test.step("Заполнить форму авторизации и нажать войти", async () => {
            await page.getByPlaceholder('Логин').fill(authCRMTestData.login);
            await page.getByPlaceholder('Пароль').fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("Проверить, что пользователь находится в CRM и видит поле поиска клиента ", async () => {
            await page.locator("//input[@data-testid='phone-input']").waitFor({ state: 'visible', timeout: 3000 });
        });
    });

    test("Проверка ошибки сброса пароля в CRM", async ({ page }) => {
        await test.step("Перейти на страницу входа в CRM", async () => {
            await page.goto(`${api.urls.test_url_crm}`);
        });

        await test.step("Нажать кнопку Не помню пароль", async () => {
            await page.locator('text=Не помню пароль').click();
        });

        await test.step("Заполнить поле email и нажать Сбросить", async () => {
            await page.getByPlaceholder('Введите ваш e-mail').fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Сбросить пароль' }).click();
        });

        await test.step("Проверить, что пользователь видит сообщение об ошибке ", async () => {
            await page.locator('text=Введён некорректный email').waitFor({ state: 'visible', timeout: 3000 });
        });
    });
});