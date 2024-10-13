import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default class createUsersRequests extends BaseRequests {
    async postCreateUsers(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.users}`, status, body);
    }

    async getUserById(status: number, parameters: object, userId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.users}/${userId}`, status, parameters);
    }
}