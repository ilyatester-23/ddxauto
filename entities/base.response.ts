import { JSONSchemaType } from "ajv";

export interface baseResponseJson {
    session_id: string;
    request_id: string;
    request_source: string;
    data: Array<object> | object;
}

export const baseResponseJsonSchema: JSONSchemaType<baseResponseJson> = {
    type: "object",
    properties: {
        session_id: { type: "string" },
        request_id: { type: "string" },
        request_source: { type: "string" },
        data: {
            anyOf: [
                {
                    type: "array",
                    items: {
                        type: "object",
                        nullable: true
                    }
                },
                {
                    type: "object",
                    nullable: true
                }
            ]
        }
    },
    required: ["session_id", "request_id"],
    additionalProperties: false
}