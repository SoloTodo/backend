export interface User {
    url: string,
    id: number,
    name: string,
    detail_url: string,
    email: string,
    first_name: string,
    last_name: string,
    preferred_language: string,
    preferred_currency: string,
    preferred_number_format: string,
    preferred_store?: string,
    preferred_stores_last_updated: string,
    preferred_stores: string[],
    preferred_exclude_refurbished: boolean,
    date_joined: string,
    is_staff: boolean,
    permissions: string[],
    is_superuser: boolean
    // add budgets fields
}

export type UserState = User | null