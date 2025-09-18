import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import api from "../api.json";

export default class groupTrainings extends BaseRequests {
    async getGroupTrainings(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${api.paths.group_trainings}`, status, parameters)
    }
}