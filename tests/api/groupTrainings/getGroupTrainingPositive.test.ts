import { expect, request, test } from "@playwright/test";
import { getBaseParameters } from "../../../entities/baseParameters";
import groupTrainings from "@requests/groupTrainings.request";

test.describe("API-тесты на получение списка названий групповых тренировок", async () => {
    test("[positive] получить список названий групповых тренировок", async ({ request }) => {
        const groupTrainingNames = new groupTrainings(request);
        const baseParameters = await getBaseParameters();

        const response = await groupTrainingNames.getGroupTrainings(200, baseParameters);

        expect(response.status()).toEqual(200)
    });
});