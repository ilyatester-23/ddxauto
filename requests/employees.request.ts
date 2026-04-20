import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default  class EmployeesRequest extends BaseRequests {
    async getEmployeeById(status: number, parameters: object,): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.employees}`, status, parameters);
    }
}