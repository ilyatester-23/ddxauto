import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default class AccessCardRequests extends BaseRequests {
    async postAccessCards(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.access_cards}`, status, body);
    }

    async getAccessCardById(status: number, parameters: object, accessCardId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.access_cards}/${accessCardId}`, status, parameters);
    }
}