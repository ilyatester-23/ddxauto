import Ajv from "ajv";
import { log } from "./logger";

export async function validateJson(schema: any, json: JSON | any, schemaName?: string): Promise<boolean> {
    console.log(schemaName ?? 'ПРОВЕРКА СХЕМЫ ${schemaName}')
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    log("expected response schema", schema);

    if (validate(json)) {
        console.log("\nRESPONSE SUCCESSFULLY VALIIDATED");
        return true;
    } else {
        console.log();
        console.log(validate.errors);
        throw new Error("response didn`t validate").message;
    }
}