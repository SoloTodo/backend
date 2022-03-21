import { fetchJson } from "./utils";

export function authenticate(email: string, password: string) {
    const formData = JSON.stringify({email, password});
    return fetchJson('auth/token/', {headers: {}, method: 'POST', body: formData});
}