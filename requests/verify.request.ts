import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default class VerifyRequest extends BaseRequests {
    
    async postGetCode(status: number, requestData: any): Promise<APIResponse> {
        return (await this.post(`${this.baseUrl}${paths.paths.get_code}`, status, requestData));
    }
}