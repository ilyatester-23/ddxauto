import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default class UsersSearch extends BaseRequests {
    
    async postUsersSearch(status: number, requestData: any): Promise<APIResponse> {
        return (await this.post(`${this.baseUrl}${paths.paths.users_search}`, status, requestData));
    }
}