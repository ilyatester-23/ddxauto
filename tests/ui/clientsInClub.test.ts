import test from "@playwright/test";
import api from '../../api.json';
import authCRMTestData from "@data/authCRM.json";

test.describe ("Тесты на авторизацию в CRM и переход на страницу Клиенты в клубе", async () => {
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

        await test.step("Перейти на страницу Клиенты в клубе", async () => {
            await page.goto("https://crm.test.ddxfitness.ru/clients-in-club");
        });
        
        await test.step("Проверить, что пользователь находится на странице Клиенты в клубе и видит кнопку Фильтры ", async () => {
            await page.locator("//button[@type='button']").waitFor({ state: 'visible', timeout: 3000 });
        });
        
    });
});