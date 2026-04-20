import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default  class GroupTrainingTimeTableRequest extends BaseRequests {
    async postGroupTrainingTimeTable(status: number, requestData: any): Promise<APIResponse> {
        return (await this.post(`${this.baseUrl}${paths.paths.group_training_time_table}`, status, requestData));
    }
}