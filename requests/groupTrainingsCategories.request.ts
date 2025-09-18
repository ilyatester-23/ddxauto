import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import api from "../api.json";

export default class GroupTrainingCategoriesRequests extends BaseRequests {
    async getGroupTrainingCategories(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${api.paths.group_training_categories}`, status, parameters);
    }
}