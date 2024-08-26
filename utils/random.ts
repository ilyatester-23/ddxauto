export function getRandomPhoneNumber(): string {
    return `+7985${new Date().getTime().toString().substring(6)}`
};
export function getRandomEmail(): string {
    return `work${new Date().getTime().toString().substring(6)}@mail.ru`
}
