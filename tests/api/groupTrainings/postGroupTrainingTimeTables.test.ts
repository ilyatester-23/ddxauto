import { expect, test } from "@playwright/test";
import { getBaseParameters } from "@entities/baseParameters";
import groupTrainings from "@requests/groupTrainings.request";
import { Statuses } from "@libs/statuses";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import EmployeesRequest from "@requests/employees.request";
import api from '../../../api.json';
import { validateJson } from "@utils/validator.util";
import { baseResponseJsonSchema } from "@entities/base.response";
import { createGroupTrainingTimeTableResponseJsonSchema } from "@entities/groupTrainingTimeTable.response";

let groupTrainingId: number;
let employeeID: number;
let clubId: number;

test.describe("API-тесты на создание групповой тренировки в расписании", async () => {
    test("Создать групповую тренировку в расписании", async ({ request }) => {
        groupTrainingId = await test.step("Получить ID групповой тренировки НЕ удаленной из списка", async () => {
            const groupTrainingName = new groupTrainings(request);
            const baseParameters = await getBaseParameters();
            const response = await groupTrainingName.getGroupTrainings(Statuses.OK, {...baseParameters, filter: { is_deleted: false }});
            expect(response.status()).toEqual(Statuses.OK);

            const responseData = await response.json();
            return responseData?.data[0].id;
        });

        employeeID = await test.step("Получить ID эмплоя из списка", async () => {
            const employeeId = new EmployeesRequest(request);
            const baseParameters = { ...await getBaseParameters(), position_name: "Тренер"};
            const response = await employeeId.getEmployeeById(200, baseParameters);
            expect(response.status()).toEqual(200)

            const responseData = await response.json();
            return responseData?.data[0].id;
        });

        clubId = await test.step("Получить ID клуба из списка", async () => {
            const response = await request.get(
            `${api.urls.base_url_api}${api.paths.clubs}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: {...await getBaseParameters()}
            }
        );
            expect(response.status()).toEqual(200);

            const responseData = await response.json();
            return responseData?.data[0].id;
        });

        
        await test.step("Создать тренировку в расписании", async () => {

            const startDateTime = new Date();
            startDateTime.setHours(startDateTime.getHours() + 1);
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + 5);

            const groupTrainingTimeTableRequest = new GroupTrainingTimeTableRequest(request);
            const requestBody = {
                session_id: "23",
                request_id: "23",
                request_source: "crm",
                data: {
                    group_training_id: groupTrainingId,
                    employee_id: employeeID,
                    club_id: clubId,
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString()
                }
            };
            
            const response = await groupTrainingTimeTableRequest.postGroupTrainingTimeTable(Statuses.OK, requestBody);
            
            expect(response.status()).toEqual(200);
            const groupTrainingTimeTableData = await response.json();

            await test.step("Проверить схему ответа создания тренировки в расписании", async () => {
                await expect(validateJson(baseResponseJsonSchema, groupTrainingTimeTableData)).resolves.toBeTruthy();
                await expect(validateJson(createGroupTrainingTimeTableResponseJsonSchema, groupTrainingTimeTableData.data)).resolves.toBeTruthy();
            });
        });
    });
});