import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default class getClubs extends BaseRequests {
    async getClubsID(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.clubs}`, status, parameters);
    }

    async getClubById(status: number, parameters: object, clubID: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.clubs}/${clubID}`, status, parameters);
    }
}