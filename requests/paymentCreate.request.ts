import { APIResponse } from "@playwright/test";
import BaseRequests from "./baseRequest.request";
import paths from "../api.json"

export default class PaymentCreate extends BaseRequests {
    
    async postPaymentCreate(status: number, requestData: any): Promise<APIResponse> {
        return (await this.post(`${this.baseUrl}${paths.paths.payment_create}`, status, requestData));
    }
}