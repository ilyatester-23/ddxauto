import { JSONSchemaType } from "ajv";

export interface createGroupTrainingTimeTableResponseJson {
    group_training_time_table_id: number,
}

export const createGroupTrainingTimeTableResponseJsonSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            group_training_time_table_id: { type: "number" },
        },
        required: ["group_training_time_table_id"]
    }
};