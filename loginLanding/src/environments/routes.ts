import { environment } from "./environment";

export const AUTH_ROUTES = {
    LOGIN(): string {
        return `${environment.apiURL}/auth/login`;
    },

    REGISTER(): string {
        return `${environment.apiURL}/auth/register`;
    },

    UPDATE_ROLE(id: string): string {
        return `${environment.apiURL}/user/${id}/role`;
    }
}