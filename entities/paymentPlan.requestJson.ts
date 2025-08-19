import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { BaseRequestJson } from "./base.requestJson";

export interface PaymentPlanDataRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    start_date: string;
    payment_plan_id: number;
    club_id: number;
    verification_token: string;
}

export const getPaymentPlanRequestJson = async (clubId: number,): Promise<PaymentPlanDataRequestJson> => {

    const today = new Date().toISOString().split('T')[0];

    return {
        session_id: requestTestData.sessionId,
        request_id: requestTestData.requestId,
        request_source: RequestSource.CRM,
        start_date: today,
        payment_plan_id: 241,
        club_id: clubId,
        verification_token: userTestData.verification_token,
    }
}