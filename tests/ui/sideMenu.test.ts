import test from "@playwright/test";
import api from '../../api.json';
import authCRMTestData from "@data/authCRM.json";

test.describe ("Тесты на проверку бокового меню в СРМ", async () => {
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

        await test.step("Перейти на страницу Расписание", async () => {
            await page.getByRole('link', { name: 'Расписание' }).click();
        });

        await test.step("Проверить, что пользователь находится на странице Расписание и видит кнопку Добавить занятие ", async () => {
            await page.getByRole('button', { name: 'Добавить занятие' }).waitFor({ state: 'visible', timeout: 3000 });
        });

        await test.step("Перейти на страницу Акции", async () => {
            await page.getByRole('link', { name: 'Акции' }).click();
        });

        await test.step("Проверить, что пользователь находится на странице Акции и видит поле поиска Акции", async () => {
            await page.locator("input[placeholder='Поиск']").waitFor({ state: 'visible', timeout: 3000 });
        });

        await test.step("Перейти на страницу Клиенты в клубе", async () => {
            await page.getByRole('link', { name: 'Клиенты в клубе' }).click();
        });
        
        await test.step("Проверить, что пользователь находится на странице Клиенты в клубе и видит кнопку Фильтры ", async () => {
            await page.getByRole('button', { name: 'Фильтры' }).waitFor({ state: 'visible', timeout: 3000 });
        });

        await test.step("Перейти на страницу Аналитика", async () => {
            await page.getByRole('link', { name: 'Аналитика' }).click();
        });

        await test.step("Проверить заголовок дашборда внутри Superset", async () => {
            const iframe = page.frameLocator('iframe');
            await iframe.locator("input[value='Отчеты для сотрудников']").waitFor({ state: 'visible', timeout: 3000 });
        });

        await test.step("Перейти на страницу FAQ", async () => {
            await page.getByRole('link', { name: 'FAQ' }).click();
        });

        await test.step("Проверить, что пользователь находится на странице FAQ и видит поле поиска", async () => {
            await page.locator("//input[@data-testid='search-select']").waitFor({ state: 'visible', timeout: 3000 });
        });
        
    });
});