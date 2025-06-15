import { RequestSource } from "@libs/requestSource";
import requestTestData from "@data/request.json"

export async function getBaseParameters(): Promise<object> {
    return {
        session_id: requestTestData.sessionId,
        request_id: requestTestData.requestId,
        "request_source": RequestSource.CRM
    }
}