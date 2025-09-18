import { expect, request, test } from "@playwright/test";
import api from '../../../api.json';
import { getBaseParameters } from "../../../entities/baseParameters";
import GroupTrainingCategoriesRequests from "@requests/groupTrainingsCategories.request";


test.describe("API-тесты на получение списка категорий групповых тренировок", async () => {
    test("Получить список категорий удаленных групповых тренировок ", async ({ request }) => {
        const groupTrainingRequests = new GroupTrainingCategoriesRequests(request);
        const baseParameters = await getBaseParameters();
        const parametersWithDeleted = { ...baseParameters, is_deleted: true };
        
        const response = await groupTrainingRequests.getGroupTrainingCategories(200, parametersWithDeleted);

        expect(response.status()).toEqual(200);
    });

    test("Получить список категорий не удаленных групповых тренировок", async ({ request }) => {
        const groupTrainingRequests = new GroupTrainingCategoriesRequests(request);
        const baseParameters = await getBaseParameters();
        
        const response = await groupTrainingRequests.getGroupTrainingCategories(200, baseParameters);

        expect(response.status()).toEqual(200);
    });
});