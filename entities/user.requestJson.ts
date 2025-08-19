import userTestData from "@data/users.json";
import requestTestData from "@data/request.json"
import { RequestSource } from "@libs/requestSource";
import { SportExperience } from "@libs/sportExperience";
import { BaseRequestJson } from "./base.requestJson";

export interface UserDataRequestJson {
    email: string;
    name: string;
    last_name: string;
    middle_name: string;
    sex: string;
    password: string;
    phone: string;
    birthday: string;
    lang: string;
    user_photo_id: number;
    home_club_id: number;
    club_access: boolean;
    admin_panel_access: boolean;
    class_registration_access: boolean;
    sport_experience: string;
}

export const getUserRequestJson = async (clubId: number, email: string, phoneNumber: string): Promise<BaseRequestJson<UserDataRequestJson>> => {
    return {
        session_id: requestTestData.sessionId,
        request_id: requestTestData.requestId,
        request_source: RequestSource.CRM,
        data: {
            email: email,
            name: userTestData.firstName,
            last_name: userTestData.lastName,
            middle_name: userTestData.middleName,
            sex: userTestData.sex.male,
            password: userTestData.password,
            phone: phoneNumber,
            birthday: userTestData.birthday,
            lang: userTestData.lang,
            user_photo_id: userTestData.userPhotoId,
            home_club_id: clubId,
            club_access: true,
            admin_panel_access: false,
            class_registration_access: true,
            sport_experience: SportExperience.NO_EXPERIENCE
    }
        }
    }